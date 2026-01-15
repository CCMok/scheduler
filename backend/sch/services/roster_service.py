from models.arrange_roster_response import ArrangeRosterResponse
from managers.db import DbSession
from helpers.roster_model_helper import RosterModelHelper
from models.arrange_roster_request import ArrangeRosterRequest
from models.roster import RosterTimeslotAssignment, RosterTimeslot
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterService:
    @staticmethod
    def arrange(request: ArrangeRosterRequest, db_session: DbSession) -> list[RosterTimeslot]:
        material = RosterMaterial(db_session=db_session, request=request)

        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_objective(material)

        solver = cp_model.CpSolver()
        status = solver.solve(material.model)

        if status != cp_model.OPTIMAL:
            return []

        return RosterService.__map_resposne(material, solver)

    @staticmethod
    def __map_resposne(
        material: RosterMaterial,
        solver: cp_model.CpSolver,
    ) -> ArrangeRosterResponse:
        roster_timeslots: list[RosterTimeslot] = []

        for timeslot in material.request.timeslots:
            roster_timeslot = RosterTimeslot(timeslot=timeslot, assignments=[])
            roster_timeslots.append(roster_timeslot)

            for post in material.posts:
                result_worker_id = None

                for worker in post.workers:
                    is_off = solver.value(
                        material.shifts[(timeslot, post.id, worker.id)]
                    ) == 0

                    if is_off:
                        continue

                    result_worker_id = worker.id
                    break

                roster_timeslot.assignments.append(RosterTimeslotAssignment(post_id=post.id, worker_id=result_worker_id))

        return ArrangeRosterResponse(root=roster_timeslots)
