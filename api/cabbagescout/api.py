from typing import List

from fastapi import FastAPI, Query
from starlette.responses import PlainTextResponse

import cabbagescout

from .database import ScoutEntriesDatabase
from .schemas import ScoutEntry


class Api:
    __slots__ = ("database", "app")

    def __init__(self, database: ScoutEntriesDatabase, parent_app, prefix="/api"):
        self.database = database
        self.app = FastAPI(
            title="CabbageScout API",
            version=cabbagescout.__version__,
            openapi_prefix=prefix,
        )

        self.app.get("/entry", response_model=List[ScoutEntry])(self.get_entries)
        self.app.get("/csv", response_model=str, response_class=PlainTextResponse)(
            self.to_csv
        )
        self.app.post("/entry")(self.set_entry)

        parent_app.mount(prefix, self.app)

    async def get_entries(
        self,
        *,
        match: int = Query(
            None, ge=1, title="The match number of a single event of qualifiers"
        ),
        team: int = Query(
            None, ge=1, le=9999, title="The team number of the scouted team"
        ),
    ):
        return await self.database.get_entries(match=match, team=team)

    async def set_entry(self, entry: ScoutEntry):
        await self.database.add_entry(entry)

    async def to_csv(self):
        return await self.database.to_csv()
