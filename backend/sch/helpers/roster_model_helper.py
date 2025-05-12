from sqlmodel import select
from models.dao import PostConstraintSetting, WorkerConstraintSetting
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
        for day in material.days:
            for post in material.posts:
                material.model.add_at_most_one(
                    material.shifts[(day, post.id, worker.id)]
                    for worker in material.workers
                    if any(post.id == worker_post.id for worker_post in worker.posts)
                )

    @staticmethod
    def __define_each_worker_max_post_per_day(material: RosterMaterial) -> None:
        for day in material.days:
            for worker in material.workers:
                material.model.add_at_most_one(
                    material.shifts[(day, post.id, worker.id)]
                    for post in worker.posts
                )

    @staticmethod
    def __define_each_worker_max_post_per_roster(material: RosterMaterial) -> None:
        for worker in material.workers:
            material.model.add(
                sum(
                    material.shifts[(day, post.id, worker.id)]
                    for day in material.days
                    for post in worker.posts
                ) <= 2
            )

    @staticmethod
    def __define_off_constraint(material: RosterMaterial) -> None:
        for off in material.offs:
            worker = next((
                worker
                for worker in material.workers
                if worker.id == off.worker_id
            ), None)

            if worker is None:
                continue

            for day in off.days:
                if day not in material.days:
                    continue

                for post in worker.posts:
                    material.model.add(
                        material.shifts[(day, post.id, off.worker_id)] == 0
                    )

    @staticmethod
    def define_objective(db_session: DbSession, material: RosterMaterial) -> None:
        total_assignment_reward = RosterModelHelper.__create_total_assignment_reward(
            material
        )

        posts_constraint_reward = RosterModelHelper.__create_posts_constraint_reward(
            db_session, material
        )

        workers_constraint_reward = RosterModelHelper.__create_workers_constraint_reward(
            db_session, material
        )

        worker_balancing_penalty = RosterModelHelper.__create_worker_balancing_per_post_penalty(
            material
        )

        material.model.maximize(
            2 * total_assignment_reward + posts_constraint_reward + workers_constraint_reward - worker_balancing_penalty
        )

    @staticmethod
    def __create_total_assignment_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        return sum(
            material.shifts[(day, post.id, worker.id)]
            for day in material.days
            for worker in material.workers
            for post in worker.posts
        )

    @staticmethod
    def __create_worker_balancing_per_post_penalty(material: RosterMaterial) -> cp_model.LinearExpr:
        post_worker_assignment = {
            post.id: {
                worker.id: sum(
                    material.shifts[(day, post.id, worker.id)]
                    for day in material.days
                )
                for worker in material.workers
                if any(post.id == worker_post.id for worker_post in worker.posts)
            }
            for post in material.posts
        }

        post_min_assignment = {
            post.id: material.model.new_int_var(
                0, len(material.days), f'min_assignment_{post.id}'
            )
            for post in material.posts
        }

        post_max_assignment = {
            post.id: material.model.new_int_var(
                0, len(material.days), f'max_assignment_{post.id}'
            )
            for post in material.posts
        }

        for post_id, worker_assignments in post_worker_assignment.items():
            if worker_assignments == {}:
                continue

            for total_assignment in worker_assignments.values():
                material.model.add(total_assignment >= post_min_assignment[post_id])
                material.model.add(total_assignment <= post_max_assignment[post_id])

        return sum(
            post_max_assignment[post.id] - post_min_assignment[post.id]
            for post in material.posts
        )

    @staticmethod
    def __create_posts_constraint_reward(db_session: DbSession, material: RosterMaterial) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        post_constraint_settings = RosterModelHelper.__find_post_constraint_setting(db_session, material.tenant_id)

        for constraint_setting in post_constraint_settings:
            match constraint_setting.constraint_type.enum:
                case PostsConstraintType.AT_LEAST_1_WORKER_PER_DAY.value:
                    rewards.append(
                        RosterModelHelper.__create_posts_at_least_1_worker_per_day_reward(
                            material, constraint_setting
                        ) * constraint_setting.weighting
                    )

                case _:
                    print('Unknown constraint type:', constraint_setting.constraint_type)

        return sum(rewards)

    @staticmethod
    def __find_post_constraint_setting(db_session: DbSession, tenant_id: int):
        return db_session.exec(
            select(PostConstraintSetting)
            .where(PostConstraintSetting.tenant_id == tenant_id)
        ).all()

    @staticmethod
    def __create_posts_at_least_1_worker_per_day_reward(
        material: RosterMaterial,
        constraint_setting: PostConstraintSetting,
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for day in material.days:
            reward = material.model.new_bool_var(
                f'reward_posts_at_least_1_worker_per_day_{constraint_setting.id}_{day}'
            )
            rewards.append(reward)

            material.model.add(
                sum(
                    material.shifts[(day, setting_post.post_id, worker.id)]
                    for worker in material.workers
                    for setting_post in constraint_setting.setting_posts
                    if any(setting_post.post_id == worker_post.id for worker_post in worker.posts)
                ) >= 1
            ).only_enforce_if(reward)

            material.model.add(
                sum(
                    material.shifts[(day, setting_post.post_id, worker.id)]
                    for worker in material.workers
                    for setting_post in constraint_setting.setting_posts
                    if any(setting_post.post_id == worker_post.id for worker_post in worker.posts)
                ) < 1
            ).only_enforce_if(reward.Not())

        return sum(rewards)

    @staticmethod
    def __create_workers_constraint_reward(db_session: DbSession, material: RosterMaterial) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        worker_constraint_settings = RosterModelHelper.__find_worker_constraint_setting(db_session, material.tenant_id)

        for constraint_setting in worker_constraint_settings:
            match constraint_setting.constraint_type.enum:
                case WorkersConstraintType.CORRELATE.value:
                    rewards.append(
                        RosterModelHelper.__create_workers_correlate_reward(
                            material, constraint_setting
                        ) * constraint_setting.weighting
                    )

                case _:
                    print('Unkown constraint type: ', constraint_setting.constraint_type)

        return sum(rewards)

    @staticmethod
    def __find_worker_constraint_setting(db_session: DbSession, tenant_id: int):
        return db_session.exec(
            select(WorkerConstraintSetting)
            .where(WorkerConstraintSetting.tenant_id == tenant_id)
        ).all()

    @staticmethod
    def __create_workers_correlate_reward(
            material: RosterMaterial, constraint_setting: WorkerConstraintSetting
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        workers = [
            worker
            for worker in material.workers
            if worker.id in [
                setting_worker.worker_id
                for setting_worker in constraint_setting.setting_workers
            ]
        ]

        for day in material.days:
            reward = material.model.new_bool_var(f'reward_workers_correlate_{constraint_setting.id}_{day}')
            rewards.append(reward)

            worker_assigneds: list[cp_model.IntVar] = []

            for worker in workers:
                worker_assigned = material.model.new_bool_var(
                    f'reward_workers_correlate_{constraint_setting.id}_{day}_worker_assigned_{worker.id}'
                )
                worker_assigneds.append(worker_assigned)

                material.model.add(
                    sum(
                        material.shifts[(day, post.id, worker.id)]
                        for post in worker.posts
                    ) >= 1
                ).only_enforce_if(worker_assigned)

                material.model.add(
                    sum(
                        material.shifts[(day, post.id, worker.id)]
                        for post in worker.posts
                    ) < 1
                ).only_enforce_if(worker_assigned.Not())

            material.model.add_bool_and(worker_assigneds).only_enforce_if(reward)
            material.model.add_bool_or([
                worker_assigned.Not()
                for worker_assigned in worker_assigneds
            ]).only_enforce_if(reward.Not())

        return sum(rewards)
