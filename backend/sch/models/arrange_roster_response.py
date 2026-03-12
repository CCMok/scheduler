from pydantic import RootModel
from .roster import RosterPost


class ArrangeRosterResponse(RootModel[list[RosterPost]]):
    pass
