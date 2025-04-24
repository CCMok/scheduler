from models.worker import Worker
from models.post import Post
from models.schedule import Schedule
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


def arrange_roster_service() -> list[Schedule]:
    material = get_material()
    model = cp_model.CpModel()
    shifts = create_shifts(material, model)

    # Define constraints
    define_each_post_max_worker(material, model, shifts)
    define_each_worker_max_post_per_week(material, model, shifts)
    define_each_worker_max_post_per_roster(material, model, shifts)

    define_objective(material, model, shifts)

    # TODO

    solver = cp_model.CpSolver()
    status = solver.solve(model)

    if status != cp_model.OPTIMAL:
        # TODO
        return []

    # Map result to response
    for week in material.weeks:
        print(f'\nWeek: {week}')

        for post in material.posts:
            result_worker = ''

            for worker in material.workers:
                if post.id not in worker.post_ids:
                    continue

                isOff = solver.value(shifts[(week, post.id, worker.id)]) == 0
                if isOff:
                    continue

                result_worker = worker.name
                continue

            print(f'{post.name}: {result_worker}')

    # Return response

    return get_dummy_response()


def get_dummy_response():
    return [
        {
            'week': 1,
            'arrangement': {
                'host': 'Alice',
                'worshipLeader': 'Bob',
            },
        },
        {
            'week': 2,
            'arrangement': {
                'host': 'Frank',
                'worshipLeader': 'Grace',
            },
        },
    ]


def get_material() -> RosterMaterial:
    return RosterMaterial(
        weeks=get_weeks(),
        posts=get_posts(),
        workers=get_workers(),
    )


def get_posts() -> list[Post]:
    return [
        Post(
            id=0,
            name='Host',
        ),
        Post(
            id=1,
            name='Worship Leader',
        ),
        Post(
            id=2,
            name='Keyboard',
        ),
        Post(
            id=3,
            name='Guitar',
        ),
        Post(
            id=4,
            name='Drum',
        ),
        Post(
            id=5,
            name='Bass',
        ),
        Post(
            id=6,
            name='Vocal Women',
        ),
        Post(
            id=7,
            name='Vocal Men',
        ),
        Post(
            id=8,
            name='Audio',
        ),
        Post(
            id=9,
            name='Powerpoint',
        ),
    ]


def get_workers() -> list[Worker]:
    return [
        Worker(
            id=0,
            name='Jane',
            post_ids=[0],
        ),
        Worker(
            id=1,
            name='Alan',
            post_ids=[1],
        ),
        Worker(
            id=2,
            name='QQ',
            post_ids=[2],
        ),
        Worker(
            id=3,
            name='Gogo',
            post_ids=[3],
        ),
        Worker(
            id=4,
            name='Jeffery',
            post_ids=[4],
        ),
        Worker(
            id=5,
            name='Shu Yan',
            post_ids=[6],
        ),
        Worker(
            id=6,
            name='Vincent',
            post_ids=[7],
        ),
        Worker(
            id=7,
            name='Marco',
            post_ids=[8],
        ),
        Worker(
            id=8,
            name='YL',
            post_ids=[9],
        ),
        Worker(
            id=9,
            name='Foon',
            post_ids=[0],
        ),
        Worker(
            id=10,
            name='Chow Sir',
            post_ids=[0, 1, 8],
        ),
        Worker(
            id=11,
            name='Sunny',
            post_ids=[4],
        ),
        Worker(
            id=12,
            name='Pakho',
            post_ids=[7],
        ),
        Worker(
            id=13,
            name='Andrea',
            post_ids=[9],
        ),
        Worker(
            id=14,
            name='Jason',
            post_ids=[1, 7],
        ),
        Worker(
            id=15,
            name='Kathryn',
            post_ids=[6],
        ),
        Worker(
            id=16,
            name='Simmon',
            post_ids=[0],
        ),
        Worker(
            id=17,
            name='Florence',
            post_ids=[1],
        ),
        Worker(
            id=18,
            name='Amy',
            post_ids=[6],
        ),
        Worker(
            id=19,
            name='Kwok Fai',
            post_ids=[0],
        ),
        Worker(
            id=20,
            name='Betty',
            post_ids=[1],
        ),
        Worker(
            id=21,
            name='Picnic',
            post_ids=[8],
        ),
        Worker(
            id=22,
            name='Ka yan',
            post_ids=[9],
        ),
        Worker(
            id=23,
            name='Louis',
            post_ids=[8],
        ),
    ]


def get_weeks() -> range:
    return range(4)


def create_shifts(
    material: RosterMaterial,
    model: cp_model.CpModel,
) -> dict[tuple[int, int, int], cp_model.IntVar]:
    shifts: dict[tuple[int, int, int], cp_model.IntVar] = {}

    for week in material.weeks:
        for worker in material.workers:
            for post_id in worker.post_ids:
                shifts[(week, post_id, worker.id)] = model.new_bool_var(
                    f'shift_{week}_{post_id}_{worker.id}'
                )

    return shifts


def define_each_post_max_worker(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    for week in material.weeks:
        for post in material.posts:
            model.add_at_most_one(
                shifts[(week, post.id, worker.id)]
                for worker in material.workers
                if post.id in worker.post_ids
            )


def define_each_worker_max_post_per_week(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    for week in material.weeks:
        for worker in material.workers:
            model.add_at_most_one(
                shifts[(week, post_id, worker.id)]
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
                shifts[(week, post_id, worker.id)]
                for week in material.weeks
                for post_id in worker.post_ids
            ) <= 2
        )


def define_objective(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    total_assignment_expression = create_total_assignment_expression(
        material, shifts
    )

    worker_balancing_expression = create_worker_balancing_expression(
        material, model, shifts
    )

    model.maximize(total_assignment_expression - worker_balancing_expression)


def create_total_assignment_expression(
    material: RosterMaterial,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> cp_model.LinearExpr:
    return sum(
        shifts[(week, post_id, worker.id)]
        for week in material.weeks
        for worker in material.workers
        for post_id in worker.post_ids
    )


def create_worker_balancing_expression(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> cp_model.LinearExpr:
    worker_assignment = {
        worker.id: sum(
            shifts[(week, post_id, worker.id)]
            for week in material.weeks
            for post_id in worker.post_ids
        )
        for worker in material.workers
    }

    min_assignment = model.new_int_var(
        0, len(material.weeks), 'min_assignement'
    )
    max_assignment = model.new_int_var(
        0, len(material.weeks), 'max_assignement'
    )

    for worker_id, total_assignment in worker_assignment.items():
        model.add(total_assignment >= min_assignment)
        model.add(total_assignment <= max_assignment)

    return max_assignment - min_assignment
