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
    define_max_constraint(material, model, shifts)

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
            print(f'{post.name}:', end=' ')

            for worker in material.workers:
                if post.id not in worker.posts:
                    continue

                isOff = solver.value(shifts[(week, post.id, worker.id)]) == 0
                if isOff:
                    continue

                print(worker.name)

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
            name='host',
        ),
        Post(
            id=1,
            name='worshipLeader',
        ),
        Post(
            id=2,
            name='keyboard',
        )
    ]


def get_workers() -> list[Worker]:
    return [
        Worker(
            id=0,
            name='Alice',
            posts=[0, 2],
        ),
        Worker(
            id=1,
            name='Bob',
            posts=[0, 1],
        ),
        Worker(
            id=2,
            name='Charlie',
            posts=[0],
        ),
        Worker(
            id=3,
            name='David',
            posts=[1],
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
        for post in material.posts:
            for worker in material.workers:
                if post.id not in worker.posts:
                    continue

                shifts[(week, post.id, worker.id)] = model.NewBoolVar(
                    f'shift_{week}_{post.id}_{worker.id}'
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
                if post.id in worker.posts
            )


def define_each_worker_max_post_per_week(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    for worker in material.workers:
        for week in material.weeks:
            model.add_at_most_one(
                shifts[(week, post.id, worker.id)]
                for post in material.posts
                if post.id in worker.posts
            )


def define_max_constraint(
    material: RosterMaterial,
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
) -> None:
    model.Maximize(
        sum(
            shifts[(week, post.id, worker.id)]
            for week in material.weeks
            for post in material.posts
            for worker in material.workers
            if post.id in worker.posts
        )
    )
