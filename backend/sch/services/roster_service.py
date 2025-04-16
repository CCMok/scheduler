from models.worker import Worker
from models.post import Post
from models.schedule import Schedule
from ortools.sat.python import cp_model


def arrange_roster_service() -> list[Schedule]:
    # Define input
    posts = get_posts()
    works = get_workers()
    number_of_weeks = get_number_of_weeks()

    all_weeks = range(number_of_weeks)

    # Create Model
    model = cp_model.CpModel()

    # Define variables
    shifts = {}
    for w in all_weeks:
        pass

    # Define constrints

    # Solve model

    # Map result to response

    # Return response

    return get_dummy_response()


def get_dummy_response():
    return [
        {
            "week": 1,
            "arrangement": {
                "host": "Alice",
                "worshipLeader": "Bob",
            },
        },
        {
            "week": 2,
            "arrangement": {
                "host": "Frank",
                "worshipLeader": "Grace",
            },
        },
    ]


def get_posts() -> list[Post]:
    return [
        {
            "id": 0,
            "name": "host",
        },
        {
            "id": 1,
            "name": "worshipLeader",
        },
    ]


def get_workers() -> list[Worker]:
    return [
        {
            "id": 0,
            "name": "Alice",
            "posts": [0],
        },
        {
            "id": 1,
            "name": "Bob",
            "posts": [1],
        },
        {
            "id": 2,
            "name": "Charlie",
            "posts": [0],
        },
        {
            "id": 3,
            "name": "David",
            "posts": [1],
        },
    ]


def get_number_of_weeks() -> int:
    return 4
