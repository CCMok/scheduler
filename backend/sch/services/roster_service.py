from models.arrange_roster_response import ArrangeRosterResponse
from managers.db import DbSession
from helpers.roster_model_helper import RosterModelHelper
from models.arrange_roster_request import ArrangeRosterRequest
from models.modify_roster_request import ModifyRosterRequest
from models.roster import RosterPost, RosterPostTimeslot
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterService:
    @staticmethod
    def arrange(request: ArrangeRosterRequest, db_session: DbSession) -> ArrangeRosterResponse:
        material = RosterMaterial(db_session=db_session, request=request)

        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_objective(material)

        solver = cp_model.CpSolver()
        status = solver.solve(material.model)

        if status != cp_model.OPTIMAL:
            return []

        return RosterService.__map_resposne(material, solver)

    @staticmethod
    def modify(request: ModifyRosterRequest, db_session: DbSession) -> ArrangeRosterResponse:
        material = RosterMaterial(db_session=db_session, request=request)

        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_modify_objective(
            material, request.original_roster)

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
        roster_posts: list[RosterPost] = []

        for post in material.posts:
            roster_post = RosterPost(post_id=post.id, timeslots=[])
            roster_posts.append(roster_post)

            for timeslot in material.request.timeslots:
                result_worker_id = None

                for worker in post.workers:
                    is_off = solver.value(
                        material.shifts[(timeslot, post.id, worker.id)]
                    ) == 0

                    if is_off:
                        continue

                    result_worker_id = worker.id
                    break

                roster_post.timeslots.append(RosterPostTimeslot(
                    timeslot=timeslot, worker_id=result_worker_id))

        return ArrangeRosterResponse(root=roster_posts)
