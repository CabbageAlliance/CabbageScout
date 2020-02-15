from fastapi import FastAPI

import cabbagescout

from .model import Database, TeamMatch, TeamMatchNum


class Api:
    def __init__(self, database, parent_app, prefix="/api"):
        self.database = database
        self.app = FastAPI(
            title="CabbageScout API",
            version=cabbagescout.__version__,
            openapi_prefix=prefix,
        )

        self.app.get("/database", response_model=Database)(self.get_database)
        self.app.get("/match/{num}", response_model=TeamMatchNum)(self.get_match)
        self.app.post("/match/{num}")(self.set_match)

        parent_app.mount(prefix, self.app)

    async def get_database(self):
        return self.database

    async def get_match(self, num: int):
        return self.database.matches[num]

    async def set_match(self, num: int, match: TeamMatch):
        parsed_match = TeamMatchNum.from_teammatch(match, num)
        self.database.matches[num] = parsed_match
        return parsed_match