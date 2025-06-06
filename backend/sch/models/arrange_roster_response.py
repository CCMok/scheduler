from pydantic import RootModel
from .schedule import Schedule


class ArrangeRosterResponse(RootModel[list[Schedule]]):
    pass
