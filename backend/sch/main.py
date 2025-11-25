from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dependencies.auth_dependency import verify_api_key
from routers import roster_router, health_router
from config.global_config import get_setting

app = FastAPI(
    version='0.4.0',
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


# Public routes (no authentication)
app.include_router(health_router.router)

# Protected routes (require API key)
app.include_router(roster_router.router, dependencies=[
                   Depends(verify_api_key)])

# For Render deployment
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
