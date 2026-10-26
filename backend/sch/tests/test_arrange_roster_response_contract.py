from enums.solver_status import SolverStatus
from models.arrange_roster_response import ArrangeRosterMeta, ArrangeRosterResponse
from models.roster import RosterPost, RosterPostTimeslot


def test_optimal_response_shape_uses_camel_case_aliases():
    response = ArrangeRosterResponse(
        status=SolverStatus.OPTIMAL,
        posts=[
            RosterPost(
                post_id=1,
                timeslots=[RosterPostTimeslot(timeslot="日班", worker_id=3)],
            )
        ],
        meta=ArrangeRosterMeta(solve_ms=42),
    )

    payload = response.model_dump(by_alias=True)
    assert payload == {
        "status": "OPTIMAL",
        "posts": [
            {
                "postId": 1,
                "timeslots": [{"timeslot": "日班", "workerId": 3}],
            }
        ],
        "meta": {"solveMs": 42, "hints": None},
    }


def test_infeasible_response_has_status_and_no_posts():
    response = ArrangeRosterResponse(
        status=SolverStatus.INFEASIBLE,
        posts=None,
        meta=ArrangeRosterMeta(solve_ms=10),
    )

    payload = response.model_dump(by_alias=True)
    assert payload["status"] == "INFEASIBLE"
    assert payload["posts"] is None
    # Contract: failure is status, not empty array root
    assert not isinstance(payload, list)


def test_feasible_response_includes_posts():
    response = ArrangeRosterResponse(
        status=SolverStatus.FEASIBLE,
        posts=[
            RosterPost(
                post_id=2,
                timeslots=[RosterPostTimeslot(timeslot="夜班", worker_id=9)],
            )
        ],
    )

    payload = response.model_dump(by_alias=True)
    assert payload["status"] == "FEASIBLE"
    assert payload["posts"][0]["postId"] == 2
