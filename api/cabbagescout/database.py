from typing import List, Mapping

import sqlalchemy as sa
from databases import Database
from fastapi import HTTPException
from sqlalchemy.sql import Select

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
        await self._connection.fetch_one(self.table.select())  # please don't error

    async def close(self) -> None:
        await self._connection.disconnect()

    async def add_entry(self, entry: ScoutEntryID) -> None:
        await self._connection.execute(self.table.insert(), entry.json())

    async def get_entry(self, _id: int) -> ScoutEntryID:
        select = self.table.select().where(self.table.c.entry_id == _id)
        entry = await self._connection.fetch_one(select)
        print(entry)

        if entry is None:
            raise HTTPException(
                status_code=404, detail=f"Entry with ID {_id} not found"
            )

        return ScoutEntryID(**entry)

    async def assert_entry_exists(self, _id) -> None:
        exists = await self._connection.fetch_one(
            self.table.select(whereclause=self.table.c.entry_id == _id)
        )

        if not exists:
            raise HTTPException(
                status_code=404, detail=f"Entry with ID {_id} not found"
            )

    async def edit_entry(self, _id: int, entry: ScoutEntry):
        await self.assert_entry_exists(_id)
        update = self.table.update(
            whereclause=self.table.c.entry_id == _id, values=entry.json()
        )

        await self._connection.execute(update)

    async def delete_entry(self, _id) -> None:
        await self.assert_entry_exists(_id)
        delete = self.table.delete(whereclause=self.table.c.entry_id == _id)
        await self._connection.execute(delete)

    async def count_rows(self, match: int = None, team: int = None) -> int:
        count = self.table.count()

        if match:
            count = count.where(self.table.c.match == match)
        if team:
            count = count.where(self.table.c.team == team)

        return await self._connection.execute(count)

    async def get_entries(
        self, match: int = None, team: int = None, offset: int = 0, limit: int = None
    ) -> List[ScoutEntryID]:
        select = self.table.select().order_by(self.table.c.timestamp).offset(offset)

        if limit:
            select = select.limit(limit)
        if match:
            select = select.where(self.table.c.match == match)
        if team:
            select = select.where(self.table.c.team == team)

        _entries = await self._connection.fetch_all(select)
        return [ScoutEntryID(**data) for data in _entries]

    async def get_teams(self) -> List[int]:
        select = Select([self.table.c.team], distinct=True)
        teams = await self._connection.fetch_all(select)
        return [n for team in teams for n in team.values()]

    async def to_csv(self, delimiter: str = ",") -> str:
        _entries: List[Mapping] = await self._connection.fetch_all(self.table.select())
        # we like duck typing
        csv_data = util.data_to_csv(_entries, delimiter)
        if not csv_data:
            raise HTTPException(status_code=404, detail="No data in database")

        return csv_data
