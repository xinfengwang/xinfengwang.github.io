"""Trace node replay on resume. Install langgraph==1.2.23."""
from collections import Counter
from importlib.metadata import version
from typing import TypedDict

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt


class State(TypedDict, total=False):
    order: str
    draft: str
    approved: bool
    terminal: str


def experiment() -> None:
    visits: Counter[str] = Counter()

    def prepare(state: State) -> dict[str, str]:
        visits["prepare"] += 1
        return {"draft": f"Review cancellation for {state['order']}"}

    def approval(state: State) -> dict[str, bool]:
        # Counter is only local instrumentation. This node executes twice.
        visits["approval"] += 1
        decision = interrupt({"draft": state["draft"]})
        return {"approved": decision is True}

    def finalize(state: State) -> dict[str, str]:
        visits["finalize"] += 1
        return {"terminal": "approved" if state["approved"] else "closed"}

    builder = StateGraph(State)
    builder.add_node("prepare", prepare)
    builder.add_node("approval", approval)
    builder.add_node("finalize", finalize)
    builder.add_edge(START, "prepare")
    builder.add_edge("prepare", "approval")
    builder.add_edge("approval", "finalize")
    builder.add_edge("finalize", END)
    graph = builder.compile(checkpointer=InMemorySaver())

    first = {"configurable": {"thread_id": "ticket-12"}}
    paused = graph.invoke({"order": "A12"}, config=first)
    assert paused["__interrupt__"][0].value == {"draft": "Review cancellation for A12"}
    assert graph.get_state(first).next == ("approval",)
    assert visits == {"prepare": 1, "approval": 1}
    print("paused:", dict(visits))

    final = graph.invoke(Command(resume=True), config=first)
    assert final["terminal"] == "approved"
    assert graph.get_state(first).next == ()
    assert visits == {"prepare": 1, "approval": 2, "finalize": 1}
    print("resumed:", dict(visits))

    second = {"configurable": {"thread_id": "ticket-13"}}
    graph.invoke({"order": "B13"}, config=second)
    closed = graph.invoke(Command(resume=False), config=second)
    assert closed["terminal"] == "closed"
    assert graph.get_state(first).values["order"] == "A12"
    print(f"isolated threads, langgraph {version('langgraph')}")


if __name__ == "__main__":
    experiment()
