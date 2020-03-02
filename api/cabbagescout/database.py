from collections import defaultdict
from itertools import chain
from typing import DefaultDict, List, Mapping

import sqlalchemy as sa
from databases import Database

from cabbagescout.abc import Database as ABCDatabase
from cabbagescout.schemas import ScoutEntry, ScoutEntryKey


class PostgresDatabase(ABCDatabase):
    __slots__ = ("_connection", "table", "_uri")

    def __init__(self, uri: str):
        self._uri = uri
        self._connection = Database(uri)
        self.table: sa.Table

        metadata = sa.MetaData()
        engine = sa.create_engine(uri)

        self.table = sa.Table(
            "scout_entries",
            metadata,
            sa.Column("match", sa.SMALLINT),
            sa.Column("team", sa.SMALLINT),
            sa.Column("auto_crossed_line", sa.BOOLEAN),
            sa.Column("auto_uppergoal_scored", sa.SMALLINT),
            sa.Column("auto_lowergoal_scored", sa.SMALLINT),
            sa.Column("auto_uppergoal_missed", sa.SMALLINT),
            sa.Column("teleop_uppergoal_scored", sa.SMALLINT),
            sa.Column("teleop_lowergoal_scored", sa.SMALLINT),
            sa.Column("teleop_uppergoal_missed", sa.SMALLINT),
            sa.Column("rotation_control_time", sa.FLOAT),
            sa.Column("position_control_time", sa.FLOAT),
            sa.Column("defending_time", sa.FLOAT),
            sa.Column("hang_attempted", sa.BOOLEAN),
            sa.Column("hang_succeeded", sa.BOOLEAN),
            sa.Column("hang_time", sa.FLOAT),
            sa.Column("hang_level", sa.BOOLEAN),
            sa.Column("driver_rating", sa.SMALLINT),
            sa.Column("down_time", sa.FLOAT),
            sa.Column("comments", sa.String(512)),
            sa.Column("received_foul", sa.BOOLEAN),
        )

        metadata.create_all(engine)

    async def connect(self):
        await self._connection.connect()

    async def close(self):
        await self._connection.disconnect()

    async def add_entry(self, entry: ScoutEntry) -> None:
        await self._connection.execute(self.table.insert(), entry.json())

    async def get_entries(
        self, match: int = None, team: int = None
    ) -> List[ScoutEntry]:
        select = self.table.select()

        if match:
            select = select.where(self.table.c.match == match)
        if team:
            select = select.where(self.table.c.team == team)

        _entries = await self._connection.fetch_all(select)
        return [ScoutEntry(**data) for data in _entries]

    async def to_csv(self, delimiter: str = ",") -> str:
        _entries: List[Mapping] = await self._connection.fetch_all(self.table.select())

        header = delimiter.join(k.replace("_", " ").title() for k in _entries[0].keys())
        data = "\n".join(
            delimiter.join(
                str(v).lower()  # cast to string, lowercase for javascript booleans
                if not isinstance(v, str)
                else f'"{v}"'.replace("\n", "\\n")  # sanitize strings
                for v in e.values()
            )
            for e in _entries
        )

        return f"{header}\n{data}"


class DictDatabase(ABCDatabase):  # for testing purposes
    __slots__ = "db"

    def __init__(self):
        super().__init__()
        self.db: DefaultDict[ScoutEntryKey, List[ScoutEntry]] = defaultdict(List)

    async def connect(self):
        pass

    async def close(self):
        pass

    async def get_entries(
        self, match: int = None, team: int = None
    ) -> List[ScoutEntry]:
        if match is None:
            if team is None:
                entries = self.db.values()
            else:
                entries = (self.db[key] for key in self.db.keys() if key.team == team)
        else:
            if team is None:
                entries = (self.db[key] for key in self.db.keys() if key.match == match)
            else:
                return self.db[ScoutEntryKey(match=match, team=team)]

        return list(chain.from_iterable(entries))

    async def add_entry(self, entry: ScoutEntry):
        key = ScoutEntryKey.from_scoutentry(entry)
        self.db[key].append(entry)

        return key

    async def to_csv(self, delimiter: str = ",") -> str:
        # TODO: implement
        return await super().to_csv()
