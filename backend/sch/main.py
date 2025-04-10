from fastapi import FastAPI
from services.roster_service import arrange_roster

app = FastAPI()


@app.post("/roster")
async def postRoster():
    arrange_roster()
    return {"message": "Roster arranged"}
