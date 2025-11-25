from sqlmodel import select
from models.dao import PostConstraint, WorkerConstraint
from managers.db import DbSession
from enums.constraint_type import PostsConstraintType, WorkersConstraintType
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterModelHelper:
    @staticmethod
    def define_constraints(material: RosterMaterial) -> None:
        RosterModelHelper.__define_each_post_max_worker(material)
        RosterModelHelper.__define_each_worker_max_post_per_day(material)
        RosterModelHelper.__define_each_worker_max_post_per_roster(material)
        RosterModelHelper.__define_off_constraint(material)

    @staticmethod
    def __define_each_post_max_worker(material: RosterMaterial) -> None:
        for day in material.request.days:
            for post in material.posts:
                material.model.add_at_most_one(
                    material.shifts[(day, post.id, worker.id)]
                    for worker in post.active_workers
                )

    @staticmethod
    def __define_each_worker_max_post_per_day(material: RosterMaterial) -> None:
        for day in material.request.days:
            for worker in material.workers:
                material.model.add_at_most_one(
                    material.shifts[(day, post.id, worker.id)]
                    for post in worker.active_posts
                )

    @staticmethod
    def __define_each_worker_max_post_per_roster(material: RosterMaterial) -> None:
        max_worker_post_per_roster = material.department.max_worker_post_per_roster if material.department.max_worker_post_per_roster is not None else 2

        for worker in material.workers:
            material.model.add(
                sum(
                    material.shifts[(day, post.id, worker.id)]
                    for day in material.request.days
                    for post in worker.active_posts
                ) <= max_worker_post_per_roster
            )

    @staticmethod
    def __define_off_constraint(material: RosterMaterial) -> None:
        for off in material.request.offs:
            worker = next((
                worker
                for worker in material.workers
                if worker.id == off.worker_id
            ), None)

            if worker is None:
                continue

            for day in off.days:
                if day not in material.request.days:
                    continue

                for post in worker.active_posts:
                    material.model.add(
                        material.shifts[(day, post.id, off.worker_id)] == 0
                    )

    @staticmethod
    def define_objective(material: RosterMaterial) -> None:
        total_assignment_reward = RosterModelHelper.__create_total_assignment_reward(
            material
        )

        posts_constraint_reward = RosterModelHelper.__create_posts_constraint_reward(
            material
        )

        workers_constraint_reward = RosterModelHelper.__create_workers_constraint_reward(
            material
        )

        worker_balancing_penalty = RosterModelHelper.__create_worker_balancing_per_post_penalty(
            material
        )

        material.model.maximize(
            total_assignment_reward + posts_constraint_reward +
            workers_constraint_reward - worker_balancing_penalty
        )

    @staticmethod
    def __create_total_assignment_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        return sum(
            material.shifts[(day, post.id, worker.id)] * (
                1 + material.post_worker_priorities.get(
                    (post.id, worker.id),
                    0  # default priority
                ) * 0.5
            )
            for day in material.request.days
            for post in material.posts
            for worker in post.active_workers
        )

    @staticmethod
    def __create_worker_balancing_per_post_penalty(material: RosterMaterial) -> cp_model.LinearExpr:
        # Determine which workers are available for at least one day
        available_workers_per_post = {}
        for post in material.posts:
            available_workers = []
            for worker in post.active_workers:
                # Check if worker is available for at least one day
                is_available_any_day = False
                for day in material.request.days:
                    # Check if this shift exists (worker is not completely off)
                    is_off_this_day = False
                    for off in material.request.offs:
                        if off.worker_id == worker.id and day in off.days:
                            is_off_this_day = True
                            break

                    if not is_off_this_day:
                        is_available_any_day = True
                        break

                if is_available_any_day:
                    available_workers.append(worker)

            available_workers_per_post[post.id] = available_workers

        post_worker_assignment = {
            post.id: {
                worker.id: sum(
                    material.shifts[(day, post.id, worker.id)]
                    for day in material.request.days
                )
                # Only available workers
                for worker in available_workers_per_post[post.id]
            }
            for post in material.posts
        }

        post_min_assignment = {
            post.id: material.model.new_int_var(
                0, len(material.request.days), f'min_assignment_{post.id}'
            )
            for post in material.posts
        }

        post_max_assignment = {
            post.id: material.model.new_int_var(
                0, len(material.request.days), f'max_assignment_{post.id}'
            )
            for post in material.posts
        }

        for post_id, worker_assignments in post_worker_assignment.items():
            if len(worker_assignments) == 0:  # No available workers
                continue

            for total_assignment in worker_assignments.values():
                material.model.add(total_assignment >=
                                   post_min_assignment[post_id])
                material.model.add(total_assignment <=
                                   post_max_assignment[post_id])

        return sum(
            post_max_assignment[post.id] - post_min_assignment[post.id]
            for post in material.posts
            # Only penalize posts with available workers
            if len(post_worker_assignment[post.id]) > 0
        )

    @staticmethod
    def __create_posts_constraint_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        post_constraints = RosterModelHelper.__find_post_constraints(
            material.db_session, material.request.department_id
        )

        for post_constraint in post_constraints:
            match post_constraint.post_constraint_type.enum:
                case PostsConstraintType.AT_LEAST_1_WORKER_PER_DAY.value:
                    rewards.append(
                        RosterModelHelper.__create_posts_at_least_1_worker_per_day_reward(
                            material, post_constraint
                        ) * post_constraint.weighting
                    )

                case _:
                    print('Unknown post constraint type:',
                          post_constraint.post_constraint_type)

        return sum(rewards)

    @staticmethod
    def __find_post_constraints(db_session: DbSession, department_id: int):
        return db_session.exec(
            select(PostConstraint)
            .where(PostConstraint.department_id == department_id)
        ).all()

    @staticmethod
    def __create_posts_at_least_1_worker_per_day_reward(
        material: RosterMaterial,
        post_constraint: PostConstraint,
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for day in material.request.days:
            reward = material.model.new_bool_var(
                f'reward_posts_at_least_1_worker_per_day_{post_constraint.id}_{day}'
            )
            rewards.append(reward)

            material.model.add(
                sum(
                    material.shifts[(
                        day, post_constraint_post.post_id, worker.id)]
                    for post_constraint_post in post_constraint.post_constraint_posts
                    for worker in post_constraint_post.post.workers
                    if (day, post_constraint_post.post_id, worker.id) in material.shifts
                ) >= 1
            ).only_enforce_if(reward)

            material.model.add(
                sum(
                    material.shifts[(
                        day, post_constraint_post.post_id, worker.id)]
                    for post_constraint_post in post_constraint.post_constraint_posts
                    for worker in post_constraint_post.post.workers
                    if (day, post_constraint_post.post_id, worker.id) in material.shifts
                ) < 1
            ).only_enforce_if(reward.Not())

        return sum(rewards)

    @staticmethod
    def __create_workers_constraint_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        worker_constraints = RosterModelHelper.__find_worker_constraints(
            material.db_session, material.request.department_id
        )

        for worker_constraint in worker_constraints:
            match worker_constraint.worker_constraint_type.enum:
                case WorkersConstraintType.CORRELATE.value:
                    rewards.append(
                        RosterModelHelper.__create_workers_correlate_reward(
                            material, worker_constraint
                        ) * worker_constraint.weighting
                    )

                case _:
                    print('Unkown worker constraint type: ',
                          worker_constraint.worker_constraint_type)

        return sum(rewards)

    @staticmethod
    def __find_worker_constraints(db_session: DbSession, department_id: int):
        return db_session.exec(
            select(WorkerConstraint)
            .where(WorkerConstraint.department_id == department_id)
        ).all()

    @staticmethod
    def __create_workers_correlate_reward(
            material: RosterMaterial, worker_constraint: WorkerConstraint
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for day in material.request.days:
            reward = material.model.new_bool_var(
                f'reward_workers_correlate_{worker_constraint.id}_{day}')
            rewards.append(reward)

            worker_assigneds: list[cp_model.IntVar] = []

            for worker_constraint_worker in worker_constraint.worker_constraint_workers:
                worker_assigned = material.model.new_bool_var(
                    f'reward_workers_correlate_{worker_constraint.id}_{day}_worker_assigned_'
                    f'{worker_constraint_worker.worker.id}'
                )
                worker_assigneds.append(worker_assigned)

                material.model.add(
                    sum(
                        material.shifts[(
                            day, post.id, worker_constraint_worker.worker.id)]
                        for post in worker_constraint_worker.worker.posts
                        if (day, post.id, worker_constraint_worker.worker.id) in material.shifts
                    ) >= 1
                ).only_enforce_if(worker_assigned)

                material.model.add(
                    sum(
                        material.shifts[(
                            day, post.id, worker_constraint_worker.worker.id)]
                        for post in worker_constraint_worker.worker.posts
                        if (day, post.id, worker_constraint_worker.worker.id) in material.shifts
                    ) < 1
                ).only_enforce_if(worker_assigned.Not())

            material.model.add_bool_and(
                worker_assigneds).only_enforce_if(reward)
            material.model.add_bool_or([
                worker_assigned.Not()
                for worker_assigned in worker_assigneds
            ]).only_enforce_if(reward.Not())

        return sum(rewards)
