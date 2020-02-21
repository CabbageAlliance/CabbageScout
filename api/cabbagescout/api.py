from typing import List

from fastapi import Depends, FastAPI, Query

import cabbagescout

from .schemas import Database, ScoutEntry, ScoutEntryKey, to_csv


async def EntryKey(
    match: int = Query(
        None, ge=1, title="The match number of a single event of qualifiers"
    ),
    team: int = Query(None, ge=1, le=9999, title="The team number of the scouted team"),
):
    return ScoutEntryKey(match=match, team=team)


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
        self.app.post("/entries")(self.set_entries)
        self.app.get("/csv", response_model=str)(self.get_csv)

        parent_app.mount(prefix, self.app)

    async def get_entries(self, key: ScoutEntryKey = Depends(EntryKey)):
        """
        Returns a list of **ScoutEntry**s filtered by the parameters
        """
        return self.database.get_entries(key)

    async def set_entry(self, entry: ScoutEntry):
        """
        Creates a new **ScoutEntry**
        """
        self.database.add_entry(entry)

    async def set_entries(self, entries: List[ScoutEntry]):
        """
        Creates several new **ScoutEntry**s
        """
        for entry in entries:
            self.database.add_entry(entry)

    async def get_csv(self, key: ScoutEntryKey = Depends(EntryKey)):
        """
        Returns a CSV string of **ScoutEntry**s filtered by the parameters
        """
        return to_csv(self.database.get_entries(key))
