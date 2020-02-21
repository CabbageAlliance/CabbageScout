from starlette.applications import Starlette

from .api import Api


class WebServer:
    def __init__(self, database):
        self.app = Starlette(debug=True)
        self.database = database
        self.api = Api(self.database, self.app)
