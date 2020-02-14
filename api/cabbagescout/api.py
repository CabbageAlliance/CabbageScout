from fastapi import FastAPI

import cabbagescout

from .model import Database, TeamMatch


class Api:
    def __init__(self, database, parent_app, prefix="/api"):
        self.database = database
        self.app = FastAPI(
            title="CabbageScout API",
            version=cabbagescout.__version__,
            openapi_prefix=prefix,
        )

        self.app.get("/database", response_model=Database)(self.get_database)
        self.app.get("/match/{num}", response_model=TeamMatch)(self.get_match)
        self.app.post("/match/{num}")(self.set_match)

        parent_app.mount(prefix, self.app)

    def get_database(self):
        pass

    def get_match(self, num: int):
        pass

    def set_match(self, match: TeamMatch):
        pass
