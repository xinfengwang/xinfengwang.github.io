"""A crash-and-restart receipt experiment with two SQLite files."""
from contextlib import closing
from hashlib import sha256
from pathlib import Path
from tempfile import TemporaryDirectory
import os
import sqlite3
import subprocess
import sys


OPERATION = "approved-op-12"
DRAFT = "confirmed support draft"
BASE_VERSION = 7


def init(directory: Path) -> None:
    with closing(sqlite3.connect(directory / "task.db")) as db, db:
        db.execute("CREATE TABLE task (id TEXT PRIMARY KEY, stage TEXT, operation TEXT, version INTEGER)")
        db.execute("INSERT INTO task VALUES ('job-1', 'approved', ?, NULL)", (OPERATION,))
    with closing(sqlite3.connect(directory / "target.db")) as db, db:
        db.execute("CREATE TABLE draft (id INTEGER PRIMARY KEY, version INTEGER, content TEXT)")
        db.execute("CREATE TABLE receipt (operation TEXT PRIMARY KEY, digest TEXT, version INTEGER)")
        db.execute("INSERT INTO draft VALUES (1, ?, '')", (BASE_VERSION,))


def commit_target(db: sqlite3.Connection, operation: str, text: str, expected: int) -> int:
    digest = sha256(text.encode()).hexdigest()
    db.execute("BEGIN IMMEDIATE")
    with db:
        receipt = db.execute(
            "SELECT digest, version FROM receipt WHERE operation = ?", (operation,)
        ).fetchone()
        if receipt:
            if receipt[0] != digest or receipt[1] != expected + 1:
                raise ValueError("operation key does not match the approved content or version")
            return receipt[1]
        cursor = db.execute(
            "UPDATE draft SET version = version + 1, content = ? WHERE id = 1 AND version = ?",
            (text, expected),
        )
        if cursor.rowcount != 1:
            raise ValueError("target version changed")
        version = expected + 1
        db.execute("INSERT INTO receipt VALUES (?, ?, ?)", (operation, digest, version))
        return version


def worker(directory: Path, crash: bool = False) -> int:
    with closing(sqlite3.connect(directory / "task.db")) as task:
        stage, operation, version = task.execute(
            "SELECT stage, operation, version FROM task WHERE id = 'job-1'"
        ).fetchone()
        if stage == "complete":
            return version
        with closing(sqlite3.connect(directory / "target.db")) as target:
            version = commit_target(target, operation, DRAFT, BASE_VERSION)
        if crash:
            os._exit(75)
        with task:
            task.execute(
                "UPDATE task SET stage = 'complete', version = ? WHERE id = 'job-1'", (version,)
            )
        return version


def view(directory: Path) -> tuple[str, int, int]:
    with closing(sqlite3.connect(directory / "task.db")) as task:
        stage, = task.execute("SELECT stage FROM task").fetchone()
    with closing(sqlite3.connect(directory / "target.db")) as target:
        version, = target.execute("SELECT version FROM draft WHERE id = 1").fetchone()
        count, = target.execute("SELECT COUNT(*) FROM receipt").fetchone()
    return stage, version, count


def demo() -> None:
    with TemporaryDirectory() as temp:
        directory = Path(temp)
        init(directory)
        run = subprocess.run([sys.executable, __file__, "crash-after-commit", str(directory)], check=False)
        assert run.returncode == 75
        assert view(directory) == ("approved", 8, 1)
        print("after exit:", view(directory))
        assert worker(directory) == worker(directory) == 8
        assert view(directory) == ("complete", 8, 1)
        print("after recovery:", view(directory))
        with closing(sqlite3.connect(directory / "target.db")) as db:
            for operation, text in ((OPERATION, "changed payload"), ("different-key", DRAFT)):
                try:
                    commit_target(db, operation, text, BASE_VERSION)
                except ValueError as error:
                    print(error)
                else:
                    raise AssertionError("invalid operation was accepted")
        assert view(directory) == ("complete", 8, 1)


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "crash-after-commit":
        worker(Path(sys.argv[2]), crash=True)
    else:
        demo()
