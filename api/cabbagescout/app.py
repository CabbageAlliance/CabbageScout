from starlette.applications import Starlette

from .api import Api
from .models import Database


class WebServer:
    def __init__(self):
        self.app = Starlette(debug=True)
        self.database = Database()
        self.api = Api(self.database, self.app)
