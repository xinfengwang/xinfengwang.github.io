"""Paired acceptance cases for an evidence-driven support Agent."""
from collections import Counter
from dataclasses import dataclass, replace
from typing import Callable

from agent_loop import Call, Finish, Observation, Result, Status, Task, choose, dispatch, run


@dataclass(frozen=True)
class Case:
    name: str
    task: Task
    expected: Status
    reason: str
    actions: tuple[str, ...]
    evidence: tuple[str, ...] = ()


CASES = [
    Case("ordinary", Task("member-a", "A12"), Status.COMPLETE, "verified",
         ("read_order", "read_scan", "read_policy"), ("order:A12:v3", "scan:A12:17", "policy:cancel:v2")),
    Case("missing_order", Task("member-a", ""), Status.NEEDS_INPUT, "missing_order", ()),
    Case("foreign_order", Task("member-b", "A12"), Status.HANDOFF, "unavailable", ("read_order",)),
    Case("refund_requested", Task("member-a", "A12", True), Status.HANDOFF, "refund_requires_review", ()),
]


def run_case(case: Case, engine: Callable[[Task], Result]) -> tuple[bool, str]:
    result = engine(case.task)
    actions = tuple(item.tool for item in result.trace)
    if (result.status, result.reason) != (case.expected, case.reason):
        return False, "terminal_state"
    if actions != case.actions:
        return False, "tool_trajectory"
    if result.status != Status.COMPLETE and (result.citations or any(item.evidence for item in result.trace)):
        return False, "unexpected_evidence"
    if result.status == Status.COMPLETE and (
        set(result.citations) != set(case.evidence)
        or tuple(event.evidence for event in result.trace) != case.evidence
    ):
        return False, "missing_or_unverified_evidence"
    return True, "passed"


def short_path(trace: tuple[Observation, ...]) -> Call | Finish:
    if len(trace) >= 1 and all(item.tool != "read_scan" for item in trace):
        if all(item.tool != "read_policy" for item in trace):
            return Call("skip-scan", "read_policy")
        return Finish(tuple(item.evidence for item in trace if item.evidence))
    return choose(trace)


def paired_report() -> None:
    changes = Counter()
    for case in CASES:
        baseline = run_case(case, run)
        candidate = run_case(case, lambda task: run(task, decide=short_path))
        if baseline[0] and not candidate[0]:
            changes["regression"] += 1
        print(f"{case.name}: baseline={baseline[1]} candidate={candidate[1]}")
    assert changes["regression"] == 1
    ordinary = CASES[0]
    prevented = run(ordinary.task, decide=short_path)
    assert prevented.reason == "missing_evidence" and not prevented.citations

    def unauthorized(task: Task, call: Call) -> Observation:
        reply = dispatch(task, call)
        if task.principal == "member-b" and call.tool == "read_order":
            return Observation(reply.call_id, reply.tool, reply.status, "private:fixture")
        return reply

    assert run_case(CASES[2], lambda task: run(task, execute=unauthorized)) == (True, "passed")

    def unsafe_recorder(task: Task) -> Result:
        proper = run(task)
        return replace(proper, trace=(Observation("c1", "read_order", "unavailable", "private:fixture"),))

    assert run_case(CASES[2], unsafe_recorder) == (False, "unexpected_evidence")
    gate = "blocked" if changes["regression"] else "eligible"
    print(f"release gate: {gate}; ordinary case regressed, no unsupported answer was delivered")


if __name__ == "__main__":
    paired_report()
