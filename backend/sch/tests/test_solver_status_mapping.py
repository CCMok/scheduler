from enums.solver_status import SolverStatus
from services.roster_service import RosterService
from ortools.sat.python import cp_model


def test_map_optimal():
    assert RosterService.map_solver_status(cp_model.OPTIMAL) == SolverStatus.OPTIMAL


def test_map_feasible():
    assert RosterService.map_solver_status(cp_model.FEASIBLE) == SolverStatus.FEASIBLE


def test_map_infeasible():
    assert RosterService.map_solver_status(cp_model.INFEASIBLE) == SolverStatus.INFEASIBLE


def test_map_unknown_to_error():
    assert RosterService.map_solver_status(cp_model.UNKNOWN) == SolverStatus.ERROR
