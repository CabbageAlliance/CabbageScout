import asyncio

import uvicorn
from uvicorn.loops import uvloop

from cabbagescout import WebServer
from cabbagescout import PostgresDatabase


class Server(uvicorn.Server):
    def run(self, sockets=None):
        # overriding to prevent creation of a new event loop
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.serve(sockets=sockets))


def main():
    uvloop.uvloop_setup()
    database = PostgresDatabase(
        uri="postgres://username:password@localhost:5432/cabbage-scout"
    )

    host = "0.0.0.0"
    port = 8000

    cfg = uvicorn.config.Config(app=WebServer(database).app, host=host, port=port)

    server = Server(cfg)

    server.run()


if __name__ == "__main__":
    main()
