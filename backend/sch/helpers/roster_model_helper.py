from enums.constraint_type import ConstraintType
from models.posts_constraint_setting import PostsConstraintSetting
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterModelHelper:
    @staticmethod
    def define_constraints(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> None:
        RosterModelHelper.__define_each_post_max_worker(material, model, shifts)

        # TODO: change to soft constraint
        RosterModelHelper.__define_each_worker_max_post_per_day(
            material, model, shifts
        )
        RosterModelHelper.__define_each_worker_max_post_per_roster(
            material, model, shifts
        )
        RosterModelHelper.__define_addition_constraints(material, model, shifts)

    @staticmethod
    def __define_each_post_max_worker(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> None:
        for day in material.days:
            for post in material.posts:
                model.add_at_most_one(
                    shifts[(day, post.id, worker.id)]
                    for worker in material.workers
                    if post.id in worker.post_ids
                )

    @staticmethod
    def __define_each_worker_max_post_per_day(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> None:
        for day in material.days:
            for worker in material.workers:
                model.add_at_most_one(
                    shifts[(day, post_id, worker.id)]
                    for post_id in worker.post_ids
                )

    @staticmethod
    def __define_each_worker_max_post_per_roster(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> None:
        for worker in material.workers:
            model.add(
                sum(
                    shifts[(day, post_id, worker.id)]
                    for day in material.days
                    for post_id in worker.post_ids
                ) <= 2
            )

    @staticmethod
    def __define_addition_constraints(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> None:
        for setting in material.posts_constraint_settings:
            match setting.constraint_type:
                case ConstraintType.AT_LEAST_1_WORKER_PER_DAY:
                    RosterModelHelper.__define_at_least_1_worker_per_day_per_posts(
                        material, model, shifts, setting
                    )
                case _:
                    print('Unkown constraint type : ', setting.constraint_type)

    @staticmethod
    def __define_at_least_1_worker_per_day_per_posts(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
        posts_constraint_setting: PostsConstraintSetting,
    ) -> None:
        for day in material.days:
            model.add(
                sum(
                    shifts[(day, post_id, worker.id)]
                    for worker in material.workers
                    for post_id in posts_constraint_setting.post_ids
                    if post_id in worker.post_ids
                ) >= 1
            )

    @staticmethod
    def define_objective(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> None:
        total_assignment_reward = RosterModelHelper.__create_total_assignment_reward(
            material, shifts
        )

        worker_balancing_penalty = RosterModelHelper.__create_worker_balancing_per_post_penalty(
            material, model, shifts
        )

        model.maximize(2 * total_assignment_reward - worker_balancing_penalty)

    @staticmethod
    def __create_total_assignment_reward(
        material: RosterMaterial,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> cp_model.LinearExpr:
        return sum(
            shifts[(day, post_id, worker.id)]
            for day in material.days
            for worker in material.workers
            for post_id in worker.post_ids
        )

    @staticmethod
    def __create_worker_balancing_per_post_penalty(
        material: RosterMaterial,
        model: cp_model.CpModel,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
    ) -> cp_model.LinearExpr:
        post_worker_assignment = {
            post.id: {
                worker.id: sum(
                    shifts[(day, post.id, worker.id)]
                    for day in material.days
                )
                for worker in material.workers
                if post.id in worker.post_ids
            }
            for post in material.posts
        }

        post_min_assignment = {
            post.id: model.new_int_var(
                0, len(material.days), f'min_assignment_{post.id}'
            )
            for post in material.posts
        }

        post_max_assignment = {
            post.id: model.new_int_var(
                0, len(material.days), f'max_assignment_{post.id}'
            )
            for post in material.posts
        }

        for post_id, worker_assignments in post_worker_assignment.items():
            if worker_assignments == {}:
                continue

            for total_assignment in worker_assignments.values():
                model.add(total_assignment >= post_min_assignment[post_id])
                model.add(total_assignment <= post_max_assignment[post_id])

        return sum(
            post_max_assignment[post.id] - post_min_assignment[post.id]
            for post in material.posts
        )
