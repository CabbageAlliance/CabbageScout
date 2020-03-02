from starlette.applications import Starlette

from .abc import Database
from .api import Api


class WebServer:
    __slots__ = ("api", "app", "database")

    def __init__(self, database: Database):
        self.app = Starlette(
            debug=True, on_startup=[database.connect], on_shutdown=[database.close]
        )
        self.database = database
        self.api = Api(self.database, self.app)
