from fastapi import APIRouter
from models.schedule import Schedule
from services.roster_service import arrange_roster_service

router = APIRouter(
    prefix='/roster',
    tags=['roster'],
)


@router.post('')
async def arrange_roster() -> list[Schedule]:
    return arrange_roster_service()
