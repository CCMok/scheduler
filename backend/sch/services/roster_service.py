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

    print(shifts)

    # Define constrints

    # Solve model

    # Map result to response

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
