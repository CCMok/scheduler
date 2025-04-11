from models.schedule import Schedule
from ortools.sat.python import cp_model


def arrange_roster_service() -> list[Schedule]:
    model = cp_model.CpModel()

    # Define variables

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
                "piano": "Charlie",
                "drum": "David",
                "vocal1": "Eve",
            },
        },
        {
            "week": 2,
            "arrangement": {
                "host": "Frank",
                "worshipLeader": "Grace",
                "piano": "Heidi",
                "drum": "Ivan",
                "vocal1": "Judy",
            },
        },
    ]
