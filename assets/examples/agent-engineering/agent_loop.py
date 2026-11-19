"""A deterministic read-only Agent loop. Run with Python 3.11+."""
from dataclasses import dataclass
from enum import StrEnum
from time import monotonic
from typing import Callable


class Status(StrEnum):
    COMPLETE = "complete"
    NEEDS_INPUT = "needs_input"
    HANDOFF = "handoff"
    BUDGET = "budget_exhausted"


@dataclass(frozen=True)
class Task:
    principal: str
    order_id: str
    request_refund: bool = False


@dataclass(frozen=True)
class Observation:
    call_id: str
    tool: str
    status: str
    evidence: str = ""
    value: str = ""


@dataclass(frozen=True)
class Call:
    call_id: str
    tool: str


@dataclass(frozen=True)
class Finish:
    citations: tuple[str, ...]


@dataclass(frozen=True)
class Result:
    status: Status
    reason: str
    trace: tuple[Observation, ...]
    citations: tuple[str, ...] = ()


TOOLS = {"read_order", "read_scan", "read_policy"}


def dispatch(task: Task, call: Call) -> Observation:
    # The example fixtures stand in for authenticated backend services.
    if (task.principal, task.order_id) != ("member-a", "A12"):
        return Observation(call.call_id, call.tool, "unavailable")
    if call.tool == "read_order":
        return Observation(call.call_id, call.tool, "ok", "order:A12:v3", "handed_off")
    if call.tool == "read_scan":
        return Observation(call.call_id, call.tool, "ok", "scan:A12:17", "received")
    return Observation(call.call_id, call.tool, "ok", "policy:cancel:v2", "review_required")


def required_tools(observations: tuple[Observation, ...]) -> tuple[str, ...]:
    order = next((item for item in observations if item.tool == "read_order" and item.status == "ok"), None)
    if order and order.value == "handed_off":
        return ("read_order", "read_scan", "read_policy")
    return ("read_order", "read_policy")


def choose(observations: tuple[Observation, ...]) -> Call | Finish:
    """A deterministic policy substitutes for a model in the lab."""
    completed = {item.tool: item for item in observations if item.status == "ok"}
    for tool in required_tools(observations):
        if tool not in completed:
            return Call(f"c{len(observations) + 1}", tool)
    return Finish(tuple(item.evidence for item in completed.values()))


def run(
    task: Task,
    decide: Callable[[tuple[Observation, ...]], Call | Finish] = choose,
    execute: Callable[[Task, Call], Observation] = dispatch,
    max_turns: int = 6,
    timeout: float = 2.0,
) -> Result:
    trace: list[Observation] = []

    def result(status: Status, reason: str, citations: tuple[str, ...] = ()) -> Result:
        return Result(status, reason, tuple(trace), citations)

    if not task.principal:
        return result(Status.HANDOFF, "missing_principal")
    if not task.order_id:
        return result(Status.NEEDS_INPUT, "missing_order")
    if task.request_refund:
        return result(Status.HANDOFF, "refund_requires_review")

    deadline = monotonic() + timeout
    attempts: dict[str, int] = {}
    seen_ids: set[str] = set()
    for _ in range(max_turns):
        if monotonic() >= deadline:
            return result(Status.BUDGET, "deadline")
        successful = tuple(item for item in trace if item.status == "ok")
        decision = decide(tuple(trace))
        if monotonic() >= deadline:
            return result(Status.BUDGET, "deadline")
        if isinstance(decision, Finish):
            evidence = {item.tool: item.evidence for item in successful}
            required = required_tools(successful)
            if not all(evidence.get(tool) for tool in required):
                return result(Status.HANDOFF, "missing_evidence")
            expected = set(evidence.values())
            if set(decision.citations) != expected:
                return result(Status.HANDOFF, "invalid_citations")
            return result(Status.COMPLETE, "verified", decision.citations)

        if not isinstance(decision, Call) or decision.tool not in TOOLS or not decision.call_id:
            return result(Status.HANDOFF, "invalid_tool")
        if decision.call_id in seen_ids:
            return result(Status.HANDOFF, "duplicate_call_id")
        if decision.tool not in required_tools(successful):
            return result(Status.HANDOFF, "unexpected_tool")
        completed = {item.tool for item in successful}
        if decision.tool != "read_order" and "read_order" not in completed:
            return result(Status.HANDOFF, "missing_order_evidence")
        count = attempts.get(decision.tool, 0)
        if count >= 2 or decision.tool in completed:
            return result(Status.HANDOFF, "repeated_read")

        seen_ids.add(decision.call_id)
        attempts[decision.tool] = count + 1
        try:
            observation = execute(task, decision)
        except TimeoutError:
            observation = Observation(decision.call_id, decision.tool, "timeout")
        if monotonic() >= deadline:
            return result(Status.BUDGET, "deadline")
        if (observation.call_id, observation.tool) != (decision.call_id, decision.tool):
            return result(Status.HANDOFF, "correlation_mismatch")
        if observation.status == "ok" and not observation.evidence:
            return result(Status.HANDOFF, "invalid_observation")
        if observation.status != "ok":
            observation = Observation(observation.call_id, observation.tool, observation.status)
        trace.append(observation)
        if observation.status not in {"ok", "timeout"}:
            return result(Status.HANDOFF, observation.status)
        if observation.status == "timeout" and count == 1:
            return result(Status.HANDOFF, "tool_unavailable")
    return result(Status.BUDGET, "turn_limit")


def demo() -> None:
    task = Task("member-a", "A12")
    inferred = run(task)
    assert inferred.status == Status.COMPLETE
    assert inferred.citations == ("order:A12:v3", "scan:A12:17", "policy:cancel:v2")
    for item in inferred.trace:
        print(f"{item.call_id} {item.tool} {item.status} {item.evidence}")
    print(f"{inferred.status}: {inferred.reason}")

    def timeout_once(task: Task, call: Call) -> Observation:
        if call.call_id == "c1":
            raise TimeoutError
        return dispatch(task, call)

    assert run(task, execute=timeout_once).status == Status.COMPLETE
    assert run(task, decide=lambda _: Finish(("fictional",))).reason == "missing_evidence"
    assert run(Task("member-b", "A12")).reason == "unavailable"
    assert run(Task("member-a", "")).status == Status.NEEDS_INPUT
    assert run(Task("member-a", "A12", True)).reason == "refund_requires_review"
    assert run(task, max_turns=2).reason == "turn_limit"
    assert run(task, timeout=0).reason == "deadline"
    assert run(task, decide=lambda _: Call("same", "read_order")).reason == "duplicate_call_id"
    assert run(task, decide=lambda trace: Call(str(len(trace)), "read_order")).reason == "repeated_read"
    assert run(task, execute=lambda _, call: Observation("wrong", call.tool, "ok")).reason == "correlation_mismatch"

    def forged_citation(trace: tuple[Observation, ...]) -> Call | Finish:
        decision = choose(trace)
        return Finish(("fictional",)) if isinstance(decision, Finish) else decision

    assert run(task, decide=forged_citation).reason == "invalid_citations"
    print("13 assertions passed (normal, permissions, evidence, retry, termination).")


if __name__ == "__main__":
    demo()
