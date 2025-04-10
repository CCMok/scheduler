from fastapi import FastAPI
from models.schedule import Schedule
from services.roster_service import arrange_roster

app = FastAPI()


@app.post("/roster")
async def postRoster() -> list[Schedule]:
    arrange_roster()
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
