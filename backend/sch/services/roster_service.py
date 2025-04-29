from helpers.roster_model_helper import RosterModelHelper
from helpers.roster_material_helper import RosterMaterialHelper
from models.schedule import Schedule
from models.roster_material import RosterMaterial
from ortools.sat.python import cp_model


class RosterService:
    @staticmethod
    def arrange() -> list[Schedule]:
        material = RosterMaterialHelper.get_material()
        model = cp_model.CpModel()
        shifts = RosterService.__create_shifts(material, model)

        RosterModelHelper.define_constraints(material, model, shifts)
        RosterModelHelper.define_objective(material, model, shifts)

        solver = cp_model.CpSolver()
        status = solver.solve(model)

        if status != cp_model.OPTIMAL:
            # TODO
            return []

        return RosterService.__map_resposne(material, shifts, solver)

    @staticmethod
    def __create_shifts(
        material: RosterMaterial,
        model: cp_model.CpModel,
    ) -> dict[tuple[int, int, int], cp_model.IntVar]:
        shifts: dict[tuple[int, int, int], cp_model.IntVar] = {}

        for day in material.days:
            for worker in material.workers:
                for post_id in worker.post_ids:
                    shifts[(day, post_id, worker.id)] = model.new_bool_var(
                        f'shift_{day}_{post_id}_{worker.id}'
                    )

        return shifts

    @staticmethod
    def __map_resposne(
        material: RosterMaterial,
        shifts: dict[tuple[int, int, int], cp_model.IntVar],
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
                        shifts[(day, post.id, worker.id)]) == 0
                    if isOff:
                        continue

                    result_worker = worker.name
                    continue

                schedule.arrangement[post.name] = result_worker

            schedules.append(schedule)

        return schedules
