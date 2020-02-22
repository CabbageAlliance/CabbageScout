from asyncio import get_event_loop
from typing import List

import asyncpg

from .abc import Database
from .schemas import ScoutEntry


class PostgresDatabase(Database):
    __slots__ = ("_pool", "_uri")

    def __init__(self, uri: str):
        self._uri = uri
        get_event_loop().create_task(self._start())

    async def _start(self) -> None:
        self._pool = await asyncpg.create_pool(self._uri)
        async with self._pool.acquire() as con:
            make_table = """CREATE TABLE IF NOT EXISTS scout_entries (
                    match int,
                    team int,

                    auto_crossed_line bool DEFAULT false,
                    auto_uppergoal_score int DEFAULT 0,
                    auto_lowergoal_score int DEFAULT 0,
                    auto_uppergoal_missed int DEFAULT 0,

                    teleop_lowergoal_score int DEFAULT 0,
                    teleop_uppergoal_score int DEFAULT 0,
                    teleop_uppergoal_missed int DEFAULT 0,
                    rotation_control_time float8 DEFAULT 0,
                    position_control_time float8 DEFAULT 0,
                    defending_time float8 DEFAULT 0,

                    hang_attempted bool DEFAULT false,
                    hang_succeeded bool DEFAULT false,
                    hang_time float DEFAULT 0,
                    hang_level bool DEFAULT false,

                    driver_rating int2 DEFAULT 3,
                    down_time float8 DEFAULT 0,
                    comments text DEFAULT '',
                    received_foul bool DEFAULT false

                    );"""

            await con.execute(make_table)

    async def add_entry(self, entry: ScoutEntry) -> None:
        fields = entry.json()

        async with self._pool.acquire() as con:
            query = "INSERT INTO scout_entries ({k}) VALUES ({v})".format(
                k=", ".join(fields.keys()),
                v=", ".join(f"${i + 1}" for i in range(len(fields))),
            )

            await con.execute(query, *fields.values())

    async def get_entries(
        self, match: int = None, team: int = None
    ) -> List[ScoutEntry]:
        query = "SELECT * FROM scout_entries"

        if match is not None or team is not None:
            query += " WHERE "
            if match is not None:
                query += "match = $1"
                if team is not None:
                    query += " AND team = $2"
            else:
                query += "team = $1"

        _entries = await self._pool.fetch(query, match, team)
        return [ScoutEntry(**data) for data in _entries]

    async def to_csv(self, delimiter: str = ",") -> str:
        query = "SELECT * FROM scout_entries"
        _entries: List[asyncpg.Record] = await self._pool.fetch(query)

        header = delimiter.join(k.replace("_", " ").title() for k in _entries[0].keys())
        data = "\n".join(
            delimiter.join(
                str(v).lower()  # cast to string, lowercase for javascript booleans
                if not isinstance(v, str)
                else f'"{v}"'
                if "," in v  # only surround in quotes if the str contains commas
                else v
                for v in e
            )
            for e in _entries
        )

        return f"{header}\n{data}"
