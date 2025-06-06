from fastapi import APIRouter
from models.arrange_roster_response import ArrangeRosterResponse
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest
from services.roster_service import RosterService

router = APIRouter(
    prefix='/roster',
    tags=['roster'],
)


@router.post('')
async def arrange_roster(request: ArrangeRosterRequest, db_session: DbSession) -> ArrangeRosterResponse:
    return RosterService.arrange(request, db_session)
