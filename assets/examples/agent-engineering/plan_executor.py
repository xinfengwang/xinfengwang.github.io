"""Validate a finite task DAG and preserve work across a local plan revision."""
from dataclasses import dataclass
from graphlib import TopologicalSorter
from typing import Callable


@dataclass(frozen=True)
class Step:
    action: str
    dependencies: tuple[str, ...] = ()


@dataclass(frozen=True)
class Artifact:
    value: str
    version: str


def validate(plan: dict[str, Step], allowed: set[str]) -> tuple[str, ...]:
    for name, step in plan.items():
        if step.action not in allowed or len(set(step.dependencies)) != len(step.dependencies):
            raise ValueError(f"invalid action or duplicate dependency: {name}")
        if set(step.dependencies) - plan.keys():
            raise ValueError(f"unknown dependency: {name}")
    return tuple(TopologicalSorter({key: step.dependencies for key, step in plan.items()}).static_order())


def execute(
    plan: dict[str, Step],
    actions: dict[str, Callable[[tuple[Artifact, ...]], Artifact]],
    previous: dict[str, Artifact],
    changed: set[str],
) -> tuple[dict[str, Artifact], list[str]]:
    order = validate(plan, set(actions))
    artifacts: dict[str, Artifact] = {}
    rerun: list[str] = []
    invalid = set(changed)
    for name in order:
        step = plan[name]
        if name not in previous or invalid.intersection(step.dependencies):
            invalid.add(name)
        if name in invalid:
            artifacts[name] = actions[step.action](tuple(artifacts[key] for key in step.dependencies))
            rerun.append(name)
        else:
            artifacts[name] = previous[name]
    return artifacts, rerun


if __name__ == "__main__":
    plan = {
        "order": Step("read_order"),
        "policy": Step("read_policy"),
        "verify": Step("verify", ("order", "policy")),
        "deliver": Step("deliver", ("verify",)),
    }
    fixtures = {"policy_version": "v1"}

    def verify(inputs: tuple[Artifact, ...]) -> Artifact:
        order, policy = inputs
        return Artifact(f"{order.value}/{policy.value}", f"{order.version}+{policy.version}")

    actions = {
        "read_order": lambda _: Artifact("handed_off", "order-v3"),
        "read_policy": lambda _: Artifact("review_required", fixtures["policy_version"]),
        "verify": verify,
        "deliver": lambda inputs: inputs[0],
    }
    initial, first = execute(plan, actions, {}, set())
    fixtures["policy_version"] = "v2"
    revised, second = execute(plan, actions, initial, {"policy"})
    assert first == ["order", "policy", "verify", "deliver"]
    assert second == ["policy", "verify", "deliver"]
    assert revised["order"] is initial["order"]
    assert revised["deliver"].version == "order-v3+v2"
    try:
        validate({"order": Step("read_order", ("order",))}, set(actions))
    except ValueError:
        pass
    else:
        raise AssertionError("cyclic plan was accepted")
    print("first:", first)
    print("after policy update:", second)
    print("verified artifact:", revised["deliver"])
