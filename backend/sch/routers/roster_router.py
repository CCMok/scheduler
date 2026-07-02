from fastapi import APIRouter
from models.arrange_roster_response import ArrangeRosterResponse
from managers.db import DbSession
from models.arrange_roster_request import ArrangeRosterRequest
from models.modify_roster_request import ModifyRosterRequest
from services.roster_service import RosterService

router = APIRouter(
    prefix='/roster',
    tags=['roster'],
)


@router.post('')
async def arrange_roster(request: ArrangeRosterRequest, db_session: DbSession) -> ArrangeRosterResponse:
    return RosterService.arrange(request, db_session)


@router.post('/modify')
async def modify_roster(request: ModifyRosterRequest, db_session: DbSession) -> ArrangeRosterResponse:
    return RosterService.modify(request, db_session)
