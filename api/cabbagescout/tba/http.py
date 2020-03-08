import asyncio
import json
import sys
import weakref
from typing import Coroutine, Dict, Optional, Union
from urllib.parse import quote as _uri_quote

import aiohttp

from cabbagescout import __version__
from cabbagescout.errors import *

from .models import *


async def json_or_text(response: aiohttp.ClientResponse) -> Union[Dict, str]:
    text = await response.text(encoding="utf-8")
    try:
        if response.headers["content-type"] == "application/json":
            return json.loads(text)
    except KeyError:
        pass

    return text


class Route:
    __slots__ = ("path", "method", "url", "__dict__")

    BASE: str = "https://www.thebluealliance.com/api/v3"

    def __init__(self, method: str, path: str, **parameters):
        self.path: str = path
        self.method: str = method

        url = self.BASE + self.path
        if parameters:
            self.url = url.format(
                **{
                    k: _uri_quote(v) if isinstance(v, str) else v
                    for k, v in parameters.items()
                }
            )
        else:
            self.url = url


class MaybeUnlock:
    __slots__ = ("lock", "_unlock")

    def __init__(self, lock):
        self.lock = lock
        self._unlock = True

    def __enter__(self):
        return self

    def defer(self):
        self._unlock = False

    def __exit__(self, _type, value, traceback):
        if self._unlock:
            self.lock.release()


class TBAClient:
    """Represents an HTTP Client sending requests to the Blue Alliance API"""

    __slots__ = ("_api_key", "_locks", "loop", "session", "user_agent")

    def __init__(self, token: str, *, loop=None, session=None):
        self._api_key: str = token
        self.loop = asyncio.get_event_loop() if loop is None else loop
        self.session: aiohttp.ClientSession = aiohttp.ClientSession(
            loop=self.loop
        ) if session is None else session
        self._locks = weakref.WeakKeyDictionary()

        user_agent = "CabbageScout (https://github.com/CabbageAlliance/CabbageScout {0}) Python/{1[0]}.{1[1]} aiohttp/{2}"
        self.user_agent = user_agent.format(
            __version__, sys.version_info, aiohttp.__version__
        )

    async def close(self) -> None:
        try:
            await self.session.close()
        except:
            pass

    async def request(self, route: Route, **kwargs) -> Union[Dict, str]:
        method: str = route.method
        url: str = route.url

        lock = self._locks.get(url)
        if lock is None:
            lock = asyncio.Lock()
            if url is not None:
                self._locks[url] = lock

        # header creation
        headers = {"User-Agent": self.user_agent, "X-TBA-Auth-Key": self._api_key}
        # TODO: implement last-modified headers

        kwargs["headers"] = headers

        await lock.acquire()
        with MaybeUnlock(lock) as maybe_lock:
            # TODO: handle rate-limiting if it exists
            async with self.session.request(method, url, **kwargs) as r:

                data = await json_or_text(r)

                if r.status == 200:
                    return data
                elif r.status == 304:
                    # TODO: implement last-modified cache
                    raise NotModified(r, data)
                elif r.status == 401:
                    raise Unauthorized(r, data)
                else:
                    raise HTTPException(r, data)

    def get_status(self) -> Coroutine:
        return self.request(Route("GET", "/status"))

    def get_event_oprs(
        self, event_key: Optional[EventKey], year: int, name: str
    ) -> Coroutine:
        if not event_key:
            event_key = EventKey.from_year_event(year, name)

        return self.request(
            Route("GET", "/event/{event_key}/oprs"), event_key=event_key
        )
