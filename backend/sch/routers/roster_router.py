from fastapi import APIRouter
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest
from models.schedule import Schedule
from services.roster_service import RosterService

router = APIRouter(
    prefix='/roster',
    tags=['roster'],
)


@router.post('')
async def arrange_roster(request: ArrangeRosterRequest, db_session: DbSession) -> list[Schedule]:
    return RosterService.arrange(request, db_session)
