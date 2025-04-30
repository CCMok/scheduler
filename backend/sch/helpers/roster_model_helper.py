from enums.constraint_type import ConstraintType
from models.posts_constraint_setting import PostsConstraintSetting
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

        worker_balancing_penalty = RosterModelHelper.__create_worker_balancing_per_post_penalty(
            material
        )

        addition_penalty = RosterModelHelper.__create_addition_penalty(
            material)

        material.model.maximize(
            2 * total_assignment_reward - worker_balancing_penalty - addition_penalty
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
    def __create_addition_penalty(material: RosterMaterial) -> cp_model.LinearExpr:
        penalties: list[cp_model.LinearExpr] = []

        for setting in material.posts_constraint_settings:
            match setting.constraint_type:
                case ConstraintType.AT_LEAST_1_WORKER_PER_DAY:
                    penalties.append(
                        RosterModelHelper.__create_at_least_1_worker_per_day_in_posts(
                            material, setting
                        )
                    )

                case _:
                    print('Unkown constraint type : ', setting.constraint_type)

        return sum(penalties)

    @staticmethod
    def __create_at_least_1_worker_per_day_in_posts(
        material: RosterMaterial,
        posts_constraint_setting: PostsConstraintSetting,
    ) -> cp_model.LinearExpr:
        penalties = []

        for day in material.days:
            penalty = material.model.new_bool_var(f"penalty_{day}")

            material.model.add(
                sum(
                    material.shifts[(day, post_id, worker.id)]
                    for worker in material.workers
                    for post_id in posts_constraint_setting.post_ids
                    if post_id in worker.post_ids
                ) >= 1
            ).only_enforce_if(penalty.Not())

            material.model.add(
                sum(
                    material.shifts[(day, post_id, worker.id)]
                    for worker in material.workers
                    for post_id in posts_constraint_setting.post_ids
                    if post_id in worker.post_ids
                ) < 1
            ).only_enforce_if(penalty)

            penalties.append(penalty)

        return sum(penalties)
