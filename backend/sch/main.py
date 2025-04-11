from fastapi import FastAPI
from routers import roster_router

app = FastAPI(
    version='0.1.0',
    title='SCH',
    summary='Scheduler System - Scheduler Module',
)


app.include_router(roster_router.router)
