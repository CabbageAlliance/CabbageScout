from typing import List, Mapping, Optional

import sqlalchemy as sa
from databases import Database

from cabbagescout import util
from cabbagescout.schemas import ScoutEntry, ScoutEntryID


class ScoutEntriesDatabase:
    """Postgres Database for Scout Entries"""

    __slots__ = ("_connection", "table", "_uri")

    def __init__(self, uri: str):
        self._uri = uri
        self._connection = Database(uri)
        self.table: sa.Table

        metadata = sa.MetaData()
        engine = sa.create_engine(uri)

        self.table = sa.Table(  # Changes to ScoutEntry should be reflected here as well
            "scout_entries",
            metadata,
            sa.Column("scout_name", sa.String(64)),
            sa.Column("scout_team", sa.SMALLINT),
            sa.Column("timestamp", sa.BIGINT),
            sa.Column("entry_id", sa.BIGINT),
            sa.Column("match", sa.SMALLINT),
            sa.Column("team", sa.SMALLINT),
            sa.Column("auto_crossed_line", sa.BOOLEAN),
            sa.Column("auto_uppergoal_scored", sa.SMALLINT),
            sa.Column("auto_lowergoal_scored", sa.SMALLINT),
            sa.Column("auto_uppergoal_missed", sa.SMALLINT),
            sa.Column("teleop_uppergoal_scored", sa.SMALLINT),
            sa.Column("teleop_lowergoal_scored", sa.SMALLINT),
            sa.Column("teleop_uppergoal_missed", sa.SMALLINT),
            sa.Column("rotation_control", sa.BOOLEAN),
            sa.Column("position_control", sa.BOOLEAN),
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

    async def connect(self) -> None:
        await self._connection.connect()

    async def close(self) -> None:
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
        # we like duck typing
        return util.data_to_csv(_entries, delimiter)
