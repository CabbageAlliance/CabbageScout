from typing import List

from fastapi import FastAPI, Query

import cabbagescout

from .schemas import Database, ScoutEntry, ScoutEntryKey


class Api:
    __slots__ = ("database", "app")

    def __init__(self, database: Database, parent_app, prefix="/api"):
        self.database = database
        self.app = FastAPI(
            title="CabbageScout API",
            version=cabbagescout.__version__,
            openapi_prefix=prefix,
        )

        self.app.get("/entry", response_model=List[ScoutEntry])(self.get_entries)
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
        )
    ):
        return self.database.get_entries(match=match, team=team)

    async def set_entry(self, entry: ScoutEntry):
        self.database.add_entry(entry)
