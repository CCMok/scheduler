from managers.db import DbSession
from helpers.roster_model_helper import RosterModelHelper
from models.arrange_roster_request import ArrangeRosterRequest
from models.schedule import Schedule
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterService:
    @staticmethod
    def arrange(request: ArrangeRosterRequest, db_session: DbSession) -> list[Schedule]:
        material = RosterMaterial(request=request, db_session=db_session)

        RosterModelHelper.define_constraints(material, request.offs)
        RosterModelHelper.define_objective(material)

        solver = cp_model.CpSolver()
        status = solver.solve(material.model)

        if status != cp_model.OPTIMAL:
            # TODO
            return []

        return RosterService.__map_resposne(material, solver)

    @staticmethod
    def __map_resposne(
        material: RosterMaterial,
        solver: cp_model.CpSolver,
    ) -> list[Schedule]:
        schedules: list[Schedule] = []

        for day in material.days:
            schedule = Schedule(day=day, arrangement={})

            for post in material.posts:
                result_worker = ''

                for worker in material.workers:
                    if post.id not in worker.post_ids:
                        continue

                    isOff = solver.value(
                        material.shifts[(day, post.id, worker.id)]
                    ) == 0

                    if isOff:
                        continue

                    result_worker = worker.name
                    continue

                schedule.arrangement[post.name] = result_worker

            schedules.append(schedule)

        return schedules
