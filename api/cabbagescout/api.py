import asyncio
import datetime
import logging
import os
from math import ceil

from fastapi import FastAPI, HTTPException, Path, Query
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse

import cabbagescout

from .database import ScoutEntriesDatabase
from .schemas import EntryPage, ScoutEntry, ScoutEntryID, TeamData
from .tba import *

log = logging.getLogger(__name__)


class Api:
    __slots__ = ("database", "app", "_snowflake_lock", "tba_client")

    async def generate_snowflake(self, entry: ScoutEntry) -> int:
        """For identifying scout entries"""

        if not self._snowflake_lock:
            self._snowflake_lock = asyncio.Lock()

        async with self._snowflake_lock:
            n = bin(int(datetime.datetime.utcnow().timestamp() * 100))
            h = bin(abs(hash(frozenset(entry))))[2:]
            return int(f"{n}{h[:10] if len(h) >= 10 else h.zfill(10)}", 2)

    def __init__(
        self, database: ScoutEntriesDatabase, parent_app: Starlette, prefix="/api"
    ):
        self.database = database
        try:
            self.tba_client = TBAClient(token=os.environ["X-TBA-Auth-Key"])
        except KeyError:
            log.warning(
                "TBA Authorization Key not provided. Some endpoints will be unavailable"
            )

        self._snowflake_lock = asyncio.Lock()
        self.app = FastAPI(
            title="CabbageScout API",
            version=cabbagescout.__version__,
            openapi_prefix=prefix,
        )

        self.app.get("/csv", response_model=str, response_class=PlainTextResponse)(
            self.to_csv
        )
        self.app.post(
            "/entry", response_model=int, response_description="The unique entry ID"
        )(self.add_entry)
        self.app.get("/entry/{entry_id}", response_model=ScoutEntryID)(self.get_entry)
        self.app.put("/entry/{entry_id")(self.edit_entry)
        self.app.delete("/entry/{entry_id}")(self.delete_entry)
        self.app.get("/list", response_model=EntryPage)(self.get_entries)

        if self.tba_client is not None:
            self.app.get("team/{team}", response_model=TeamData)(self.get_team_data)

        parent_app.mount(prefix, self.app)

    async def get_team_data(
        self, team: int = Path(..., title="The team to fetch data on")
    ) -> TeamData:
        # TODO: implement
        ...

    async def get_entry(
        self,
        entry_id: int = Path(
            ..., alias="entry_id", title="The ID of the entry to query"
        ),
    ) -> ScoutEntryID:
        return await self.database.get_entry(entry_id)

    async def edit_entry(
        self,
        entry: ScoutEntry,
        _id: int = Path(..., alias="entry_id", title="The ID of the entry to edit"),
    ) -> None:
        await self.database.edit_entry(_id, entry)

    async def delete_entry(
        self,
        _id: int = Path(..., alias="entry_id", title="The ID of the entry to delete"),
    ) -> None:
        await self.database.delete_entry(_id)

    async def get_entries(
        self,
        *,
        match: int = Query(
            None, ge=1, title="The match number of a single event of qualifiers"
        ),
        team: int = Query(
            None, ge=1, le=9999, title="The team number of the scouted team"
        ),
        page: int = Query(1, ge=1, title="The page number to query"),
        size: int = Query(20, ge=1, title="The size of each page"),
    ) -> EntryPage:
        # number of rows matching query
        rows = await self.database.count_rows(match=match, team=team)
        # number of pages in the query
        pages = ceil(rows / size)

        if page > pages:
            raise HTTPException(status_code=400, detail="Page index out of range")

        entries = await self.database.get_entries(
            match=match, team=team, offset=(page - 1) * size, limit=size
        )

        return EntryPage(pages=pages, entries=entries, lastPage=page == pages)

    async def add_entry(self, entry: ScoutEntry) -> int:
        now = datetime.datetime.utcnow()
        ts = entry.timestamp
        week_past = (now - datetime.timedelta(weeks=1)).timestamp()
        minute_future = (now + datetime.timedelta(minutes=1)).timestamp()

        if not week_past <= ts <= minute_future:
            raise HTTPException(status_code=400, detail="Timestamp out of range")

        snowflake = await self.generate_snowflake(entry)
        _entry = ScoutEntryID(**entry.json(), entry_id=snowflake)
        await self.database.add_entry(_entry)
        return snowflake

    async def to_csv(self):
        return await self.database.to_csv()
