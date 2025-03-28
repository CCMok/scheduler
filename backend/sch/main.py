from fastapi import FastAPI

app = FastAPI()

@app.post("/schedule")
async def root():
    return {"message": "Schedule arranged"}