from starlette.applications import Starlette

from .api import Api
from .database import ScoutEntriesDatabase


class WebServer:
    __slots__ = ("api", "app", "database")

    def __init__(self, database: ScoutEntriesDatabase):
        self.app = Starlette(
            debug=True, on_startup=[database.connect], on_shutdown=[database.close]
        )
        self.database = database
        self.api = Api(self.database, self.app)
