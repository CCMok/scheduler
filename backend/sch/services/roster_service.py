from models.schedule import Schedule


def arrange_roster_service() -> list[Schedule]:
    return [
        {
            "week": 1,
            "arrangement": {
                "host": "aAlice",
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
