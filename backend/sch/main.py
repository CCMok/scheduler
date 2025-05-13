from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import roster_router
from config.global_config import get_setting

app = FastAPI(
    version='0.1.0',
    title='SCH',
    summary='Scheduler System - Scheduler Module',
)

origins = [
    get_setting().frontend_web_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(roster_router.router)
