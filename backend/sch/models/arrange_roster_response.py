from pydantic import BaseModel, ConfigDict, Field
from enums.solver_status import SolverStatus
from .roster import RosterPost


class ArrangeRosterMeta(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    solve_ms: int | None = Field(default=None, alias="solveMs")
    hints: list[str] | None = None


class ArrangeRosterResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    status: SolverStatus
    posts: list[RosterPost] | None = None
    meta: ArrangeRosterMeta | None = None
