from models.arrange_roster_response import ArrangeRosterMeta, ArrangeRosterResponse
from managers.db import DbSession
from helpers.roster_model_helper import RosterModelHelper
from models.arrange_roster_request import ArrangeRosterRequest
from models.modify_roster_request import ModifyRosterRequest
from models.roster import RosterPost, RosterPostTimeslot
from models.roster_material import RosterMaterial
from enums.solver_status import SolverStatus
from ortools.sat.python import cp_model

# Soft limit so OR-Tools can return FEASIBLE (usable approximate) instead of only OPTIMAL / empty.
SOLVE_TIME_LIMIT_SECONDS = 30.0


class RosterService:
    @staticmethod
    def arrange(request: ArrangeRosterRequest, db_session: DbSession) -> ArrangeRosterResponse:
        material = RosterMaterial(db_session=db_session, request=request)

        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_objective(material)

        solver = RosterService.__create_solver()
        status = solver.solve(material.model)

        return RosterService.__to_response(material, solver, status)

    @staticmethod
    def modify(request: ModifyRosterRequest, db_session: DbSession) -> ArrangeRosterResponse:
        material = RosterMaterial(db_session=db_session, request=request)

        RosterModelHelper.define_constraints(material)
        RosterModelHelper.define_modify_objective(
            material, request.original_roster)

        solver = RosterService.__create_solver()
        status = solver.solve(material.model)

        return RosterService.__to_response(material, solver, status)

    @staticmethod
    def __create_solver() -> cp_model.CpSolver:
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = SOLVE_TIME_LIMIT_SECONDS
        return solver

    @staticmethod
    def map_solver_status(status: int) -> SolverStatus:
        if status == cp_model.OPTIMAL:
            return SolverStatus.OPTIMAL
        if status == cp_model.FEASIBLE:
            return SolverStatus.FEASIBLE
        if status == cp_model.INFEASIBLE:
            return SolverStatus.INFEASIBLE
        return SolverStatus.ERROR

    @staticmethod
    def __to_response(
        material: RosterMaterial,
        solver: cp_model.CpSolver,
        status: int,
    ) -> ArrangeRosterResponse:
        solver_status = RosterService.map_solver_status(status)
        meta = ArrangeRosterMeta(solve_ms=int(solver.WallTime() * 1000))

        if solver_status in (SolverStatus.OPTIMAL, SolverStatus.FEASIBLE):
            return ArrangeRosterResponse(
                status=solver_status,
                posts=RosterService.__map_posts(material, solver),
                meta=meta,
            )

        return ArrangeRosterResponse(
            status=solver_status,
            posts=None,
            meta=meta,
        )

    @staticmethod
    def __map_posts(
        material: RosterMaterial,
        solver: cp_model.CpSolver,
    ) -> list[RosterPost]:
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

        return roster_posts
