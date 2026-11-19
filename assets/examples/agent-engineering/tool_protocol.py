"""Exercise precise Function Calling correlation with Python 3.11+."""
from dataclasses import dataclass
from json import JSONDecodeError, loads

from agent_loop import Call, Task, dispatch


@dataclass(frozen=True)
class Proposal:
    call_id: str
    name: str
    arguments: str


@dataclass(frozen=True)
class Reply:
    call_id: str
    status: str
    evidence: str = ""


class Batch:
    def __init__(self, task: Task):
        self.task = task
        self.seen: set[str] = set()

    def execute(self, proposals: list[Proposal]) -> list[Reply]:
        ids = [proposal.call_id for proposal in proposals]
        if any(not call_id for call_id in ids) or len(set(ids)) != len(ids) or self.seen.intersection(ids):
            raise ValueError("missing or repeated call ID")
        self.seen.update(ids)
        return [self._read(proposal) for proposal in proposals]

    def _read(self, proposal: Proposal) -> Reply:
        if proposal.name != "read_order":
            return Reply(proposal.call_id, "unknown_tool")
        try:
            arguments = loads(proposal.arguments)
        except JSONDecodeError:
            return Reply(proposal.call_id, "invalid_arguments")
        if not isinstance(arguments, dict) or set(arguments) != {"order_id"}:
            return Reply(proposal.call_id, "invalid_arguments")
        if not isinstance(arguments["order_id"], str) or arguments["order_id"] != self.task.order_id:
            return Reply(proposal.call_id, "invalid_target")
        observation = dispatch(self.task, Call(proposal.call_id, proposal.name))
        return Reply(proposal.call_id, observation.status, observation.evidence)


def correlate(proposals: list[Proposal], results: list[Reply]) -> list[Reply]:
    expected = {item.call_id for item in proposals}
    replies = {item.call_id: item for item in results}
    if len(expected) != len(proposals) or len(replies) != len(results) or replies.keys() != expected:
        raise ValueError("results must match the proposed call IDs")
    return [replies[proposal.call_id] for proposal in proposals]


if __name__ == "__main__":
    calls = [
        Proposal("m1", "read_order", '{"order_id":"A12"}'),
        Proposal("m2", "read_order", '{"order_id":"A12","principal":"other"}'),
        Proposal("m3", "read_order", "{"),
        Proposal("m4", "refund", '{}'),
        Proposal("m5", "read_order", '{"order_id":"B13"}'),
    ]
    batch = Batch(Task("member-a", "A12"))
    results = batch.execute(calls)
    assert correlate(calls, list(reversed(results))) == results
    assert [reply.status for reply in results] == [
        "ok", "invalid_arguments", "invalid_arguments", "unknown_tool", "invalid_target",
    ]
    assert not any(reply.evidence for reply in results[1:])
    assert Batch(Task("member-b", "A12")).execute(calls[:1])[0].status == "unavailable"
    for check in (lambda: batch.execute(calls[:1]), lambda: correlate(calls, results[:-1])):
        try:
            check()
        except ValueError as error:
            print(error)
        else:
            raise AssertionError("expected boundary rejection")
    print([(reply.call_id, reply.status) for reply in results])
