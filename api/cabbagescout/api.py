import asyncio
import datetime
import logging
import os
from collections import defaultdict
from math import ceil
from typing import List

from fastapi import FastAPI, HTTPException, Path, Query
from pydantic import ValidationError
from starlette.applications import Starlette
from starlette.responses import PlainTextResponse

import cabbagescout
import cabbagescout.errors

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
            self.tba_client = TBAClient()
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
            self.app.get("/teams/{team}", response_model=TeamData)(self.get_team_data)

        parent_app.mount(prefix, self.app)

    async def get_team_data(
        self, team: int = Path(..., title="The team to fetch data on")
    ) -> TeamData:
        """
        This method is long and disgusting.
        Any attempts to clean it up or increase speed ar encouraged.
        """

        entries: List[ScoutEntryID] = await self.database.get_entries(team=team)
        num_entries = len(entries)

        if num_entries == 0:
            raise HTTPException(
                status_code=404, detail=f"No entries found on team {team}"
            )

        scores = defaultdict(int)
        climb_times: List[float] = []
        defense_time: float = 0

        for entry in entries:
            scores["auto_upper_scored"] += entry.auto_uppergoal_scored
            scores["auto_upper_missed"] += entry.auto_uppergoal_missed
            scores["auto_lower_scored"] += entry.auto_lowergoal_scored
            scores["teleop_upper_scored"] += entry.teleop_uppergoal_scored
            scores["teleop_upper_missed"] += entry.teleop_uppergoal_missed
            scores["teleop_lower_scored"] += entry.teleop_lowergoal_scored
            scores["auto_crossed_line"] += 1 if entry.auto_crossed_line else 0
            scores["climb_attempts"] += 1 if entry.hang_attempted else 0
            scores["climb_successes"] += 1 if entry.hang_succeeded else 0
            scores["downs"] += 1 if entry.down_time > 0 else 0
            scores["fouls"] += 1 if entry.received_foul else 0
            defense_time += entry.defending_time

            if entry.hang_time:
                climb_times.append(entry.hang_time)

        try:
            # try to fetch OPR

            opr = Event_OPRS(
                **(
                    await self.tba_client.get_event_oprs(
                        event_key=EventKey(os.environ["event_key"])
                    )
                )
            ).oprs.get(TeamKey.from_team_number(team))
        except (cabbagescout.errors.HTTPException, ValidationError):
            opr = None

        aum = scores.get("auto_upper_missed")
        tum = scores.get("teleop_upper_missed")

        auto_upper = scores.get("auto_upper_scored")
        teleop_upper = scores.get("teleop_upper_scored")

        ca = scores.get("climb_attempts")
        ct = len(climb_times)

        data = TeamData(
            auto_line_rate=scores.get("auto_crossed_line") / num_entries,
            climb_success_rate=(scores.get("climb_successes") / ca) if ca else 0,
            climb_speed=sum(climb_times) / ct if ct else -1,
            auto=TeamData.Scoring(
                uppergoal_scored=auto_upper / num_entries,
                uppergoal_rate=(auto_upper / aum) if aum else 1,
                lowergoal_scored=scores.get("auto_lower_scored") / num_entries,
            ),
            teleop=TeamData.Scoring(
                uppergoal_scored=teleop_upper / num_entries,
                uppergoal_rate=(teleop_upper / tum) if tum else 1,
                lowergoal_scored=scores.get("teleop_lower_scored") / num_entries,
            ),
            down_rate=scores.get("downs") / num_entries,
            foul_rate=scores.get("fouls") / num_entries,
            defense_rate=defense_time / (num_entries * 165.0),
        )

        if opr:
            data.opr = opr

        return data

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
        await self.assert_timestamp_valid(entry.timestamp)
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
        await self.assert_timestamp_valid(entry.timestamp)

        snowflake = await self.generate_snowflake(entry)
        _entry = ScoutEntryID(**entry.json(), entry_id=snowflake)
        await self.database.add_entry(_entry)
        return snowflake

    async def to_csv(self):
        return await self.database.to_csv()

    async def assert_timestamp_valid(self, ts: float):
        now = datetime.datetime.utcnow()
        week_past = (now - datetime.timedelta(weeks=1)).timestamp()
        minute_future = (now + datetime.timedelta(minutes=1)).timestamp()

        print(f"past: {week_past}\nnow:  {ts}\npres: {minute_future}")

        if not (week_past <= ts <= minute_future):
            raise HTTPException(status_code=400, detail="Timestamp out of range")
