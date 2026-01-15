from pydantic import RootModel
from .roster import RosterTimeslot


class ArrangeRosterResponse(RootModel[list[RosterTimeslot]]):
    pass
