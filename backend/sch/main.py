from fastapi import FastAPI
from services.schedule_service import arrange_schedule

app = FastAPI()


@app.post("/schedule")
async def arrangeSchedule():
    arrange_schedule()
    return {"message": "Schedule arranged"}
