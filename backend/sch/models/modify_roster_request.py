from pydantic import Field
from models.arrange_roster_request import ArrangeRosterRequest
from models.roster import RosterPost


class ModifyRosterRequest(ArrangeRosterRequest):
    original_roster: list[RosterPost] = Field(alias="originalRoster")
