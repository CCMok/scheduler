from models.worker import Worker
from models.post import Post
from models.schedule import Schedule
from ortools.sat.python import cp_model


def arrange_roster_service() -> list[Schedule]:
    weeks = get_weeks()
    posts = get_posts()
    workers = get_workers()

    model = cp_model.CpModel()

    shifts = create_shifts(model, weeks, posts, workers)

    # Define constrints
    define_each_post_max_worker(model, shifts, weeks, posts, workers)
    define_max_constraint(model, shifts, weeks, posts, workers)

    # TODO

    solver = cp_model.CpSolver()
    status = solver.solve(model)

    if status != cp_model.OPTIMAL:
        # TODO
        return []

    # Map result to response
    for i in shifts:
        # TODO
        print(f'{i}: {solver.value(shifts[i])}')

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
    ]


def get_workers() -> list[Worker]:
    return [
        Worker(
            id=0,
            name='Alice',
            posts=[0],
        ),
        Worker(
            id=1,
            name='Bob',
            posts=[1],
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
    model: cp_model.CpModel,
    weeks: range,
    posts: list[Post],
    workers: list[Worker],
) -> dict[tuple[int, int, int], cp_model.IntVar]:
    shifts: dict[tuple[int, int, int], cp_model.IntVar] = {}

    for week in weeks:
        for post in posts:
            for worker in workers:
                if post.id not in worker.posts:
                    continue

                shifts[(week, post.id, worker.id)] = model.NewBoolVar(
                    f'shift_{week}_{post.id}_{worker.id}'
                )

    return shifts


def define_each_post_max_worker(
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
    weeks: range,
    posts: list[Post],
    workers: list[Worker],
) -> None:
    for week in weeks:
        for post in posts:
            model.add_at_most_one(
                shifts[(week, post.id, worker.id)]
                for worker in workers
                if post.id in worker.posts
            )


def define_max_constraint(
    model: cp_model.CpModel,
    shifts: dict[tuple[int, int, int], cp_model.IntVar],
    weeks: range,
    posts: list[Post],
    workers: list[Worker],
) -> None:
    model.Maximize(
        sum(
            shifts[(week, post.id, worker.id)]
            for week in weeks
            for post in posts
            for worker in workers
            if post.id in worker.posts
        )
    )
