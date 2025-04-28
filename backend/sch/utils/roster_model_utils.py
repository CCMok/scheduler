from enums.constraint_type import ConstraintType
from models.posts_constraint_setting import PostsConstraintSetting
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


def define_constraints(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    define_each_post_max_worker(material, model, shifts)

    # TODO: change to soft constraint
    define_each_worker_max_post_per_day(material, model, shifts)
    define_each_worker_max_post_per_roster(material, model, shifts)
    define_addition_constraints(material, model, shifts)


def define_each_post_max_worker(
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


def define_each_worker_max_post_per_day(
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


def define_each_worker_max_post_per_roster(
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


def define_addition_constraints(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    for setting in material.posts_constraint_settings:
        match setting.constraint_type:
            case ConstraintType.AT_LEAST_1_WORKER_PER_DAY:
                define_at_least_1_worker_per_day_per_posts(
                    material, model, shifts, setting
                )
            case _:
                print('Unkown constraint type : ', setting.constraint_type)


def define_at_least_1_worker_per_day_per_posts(
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


def define_objective(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    total_assignment_reward = create_total_assignment_reward(
        material, shifts
    )

    worker_balancing_reward = create_worker_balancing_reward(
        material, model, shifts
    )

    model.maximize(total_assignment_reward + worker_balancing_reward)


def create_total_assignment_reward(
    material: RosterMaterial,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> cp_model.LinearExpr:
    return sum(
        shifts[(day, post_id, worker.id)]
        for day in material.days
        for worker in material.workers
        for post_id in worker.post_ids
    )


# TODO: Change to per post arocss all days
def create_worker_balancing_reward(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> cp_model.LinearExpr:
    worker_assignment = {
        worker.id: sum(
            shifts[(day, post_id, worker.id)]
            for day in material.days
            for post_id in worker.post_ids
        )
        for worker in material.workers
    }

    min_assignment = model.new_int_var(
        0, len(material.days), 'min_assignement'
    )
    max_assignment = model.new_int_var(
        0, len(material.days), 'max_assignement'
    )

    for total_assignment in worker_assignment.values():
        model.add(total_assignment >= min_assignment)
        model.add(total_assignment <= max_assignment)

    return min_assignment - max_assignment
