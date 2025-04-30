from enums.constraint_type import PostsConstraintType, WorkersConstraintType
from models.constraint_setting import PostsConstraintSetting, WorkersConstraintSetting
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterModelHelper:
    @staticmethod
    def define_constraints(material: RosterMaterial) -> None:
        RosterModelHelper.__define_each_post_max_worker(material)
        RosterModelHelper.__define_each_worker_max_post_per_day(material)
        RosterModelHelper.__define_each_worker_max_post_per_roster(material)

    @staticmethod
    def __define_each_post_max_worker(material: RosterMaterial) -> None:
        for day in material.days:
            for post in material.posts:
                material.model.add_at_most_one(
                    material.shifts[(day, post.id, worker.id)]
                    for worker in material.workers
                    if post.id in worker.post_ids
                )

    @staticmethod
    def __define_each_worker_max_post_per_day(material: RosterMaterial) -> None:
        for day in material.days:
            for worker in material.workers:
                material.model.add_at_most_one(
                    material.shifts[(day, post_id, worker.id)]
                    for post_id in worker.post_ids
                )

    @staticmethod
    def __define_each_worker_max_post_per_roster(material: RosterMaterial) -> None:
        for worker in material.workers:
            material.model.add(
                sum(
                    material.shifts[(day, post_id, worker.id)]
                    for day in material.days
                    for post_id in worker.post_ids
                ) <= 2
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
            2 * total_assignment_reward + posts_constraint_reward + workers_constraint_reward - worker_balancing_penalty
        )

    @staticmethod
    def __create_total_assignment_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        return sum(
            material.shifts[(day, post_id, worker.id)]
            for day in material.days
            for worker in material.workers
            for post_id in worker.post_ids
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
                if post.id in worker.post_ids
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
    def __create_posts_constraint_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for setting in material.posts_constraint_settings:
            match setting.constraint_type:
                case PostsConstraintType.AT_LEAST_1_WORKER_PER_DAY:
                    rewards.append(
                        RosterModelHelper.__create_posts_at_least_1_worker_per_day_reward(
                            material, setting
                        ) * setting.weighting
                    )

                case _:
                    print('Unkown constraint type : ', setting.constraint_type)

        return sum(rewards)

    @staticmethod
    def __create_posts_at_least_1_worker_per_day_reward(
        material: RosterMaterial,
        constraint_setting: PostsConstraintSetting,
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for day in material.days:
            reward = material.model.new_bool_var(
                f'reward_posts_at_least_1_worker_per_day_{constraint_setting.id}_{day}'
            )
            rewards.append(reward)

            material.model.add(
                sum(
                    material.shifts[(day, post_id, worker.id)]
                    for worker in material.workers
                    for post_id in constraint_setting.post_ids
                    if post_id in worker.post_ids
                ) >= 1
            ).only_enforce_if(reward)

            material.model.add(
                sum(
                    material.shifts[(day, post_id, worker.id)]
                    for worker in material.workers
                    for post_id in constraint_setting.post_ids
                    if post_id in worker.post_ids
                ) < 1
            ).only_enforce_if(reward.Not())

        return sum(rewards)

    @staticmethod
    def __create_workers_constraint_reward(material: RosterMaterial) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        for setting in material.workers_constraint_settings:
            match setting.constraint_type:
                case WorkersConstraintType.CORRELATE:
                    rewards.append(
                        RosterModelHelper.__create_workers_correlate_reward(
                            material, setting
                        ) * setting.weighting
                    )

                case _:
                    print('Unkown constraint type : ', setting.constraint_type)

        return sum(rewards)

    @staticmethod
    def __create_workers_correlate_reward(
            material: RosterMaterial, constraint_setting: WorkersConstraintSetting
    ) -> cp_model.LinearExpr:
        rewards: list[cp_model.LinearExpr] = []

        workers = [
            worker
            for worker in material.workers
            if worker.id in constraint_setting.worker_ids
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
                        material.shifts[(day, post_id, worker.id)]
                        for post_id in worker.post_ids
                    ) >= 1
                ).only_enforce_if(worker_assigned)

                material.model.add(
                    sum(
                        material.shifts[(day, post_id, worker.id)]
                        for post_id in worker.post_ids
                    ) < 1
                ).only_enforce_if(worker_assigned.Not())

            material.model.add_bool_and(worker_assigneds).only_enforce_if(reward)
            material.model.add_bool_or([
                worker_assigned.Not()
                for worker_assigned in worker_assigneds
            ]).only_enforce_if(reward.Not())

        return sum(rewards)
