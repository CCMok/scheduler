from fastapi import APIRouter
from models.arrange_roster_request import ArrangeRosterRequest
from models.schedule import Schedule
from services.roster_service import RosterService

router = APIRouter(
    prefix='/roster',
    tags=['roster'],
)


@router.post('')
async def arrange_roster(request: ArrangeRosterRequest) -> list[Schedule]:
    return RosterService.arrange(request)
