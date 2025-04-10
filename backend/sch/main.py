from fastapi import FastAPI
from models.schedule import Schedule
from services.roster_service import arrange_roster_service

app = FastAPI(
    version="0.1.0",
    title="SCH",
    summary="Scheduler System - Scheduler Module",
)


@app.post("/roster")
async def arrange_roster() -> list[Schedule]:
    return arrange_roster_service()
