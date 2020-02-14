import uvicorn

from cabbagescout.app import WebServer


def main():
    host = "0.0.0.0"
    port = 8000

    server = WebServer()

    uvicorn.run(server.app, host=host, port=port)


if __name__ == "__main__":
    main()
