__all__ = (
    "CabbageException",
    "Unexplained",
    "HTTPException",
    "NotModified",
    "Unauthorized",
    "HTTPUnexplained",
)


def flatten_error_dict(d, key=""):
    items = []
    for k, v in d.items():
        new_key = key + "." + k if key else k

        if isinstance(v, dict):
            try:
                _errors = v["_errors"]
            except KeyError:
                items.extend(flatten_error_dict(v, new_key).items())
            else:
                items.append((new_key, " ".join(x.get("message", "") for x in _errors)))
        else:
            items.append((new_key, v))

    return dict(items)


class CabbageException(Exception):
    """Base exception class for CabbageScout"""

    pass


class Unexplained(CabbageException):
    """Something went extremely wrong for this to be thrown"""

    pass


class HTTPException(CabbageException):
    """General HTTP Exception

    Attributes
    ------------
    response: :class:`aiohttp.ClientResponse`
        The response of the failed HTTP request. This is an
        instance of :class:`aiohttp.ClientResponse`. In some cases
        this could also be a :class:`requests.Response`.
    text: :class:`str`
        The text of the error. Could be an empty string.
    status: :class:`int`
        The status code of the HTTP request.
    """

    def __init__(self, response, message):
        self.response = response
        self.text: str
        self.status: int = response.status
        if isinstance(message, dict):
            try:
                errors = message["Errors"]
                errors = flatten_error_dict(errors)
                self.text = "\n".join("In %s: %s" % t for t in errors.items())
            except KeyError:
                try:
                    errors = message["Error"]
                    errors = flatten_error_dict(errors)
                    self.text = "\n".join("In %s: %s" % t for t in errors.items())
                except KeyError:
                    self.text = ""
        else:
            self.text = message

        fmt = "{0.status} {0.reason}"
        if len(self.text):
            fmt += ": {1}"

        super().__init__(fmt.format(self.response, self.text))


class NotModified(HTTPException):
    """Raised when we get a 304 from tba

    Attributes
    ------------
    last_modified: :class:`str`
        The time the requested data was last modified.
    """

    def __init__(self, response, message):
        super().__init__(response, message)
        self.last_modified: str = response.headers.get("last-modified")


class Unauthorized(HTTPException):
    """Raised when we get a 401 from tba"""

    pass


class HTTPUnexplained(HTTPException, Unexplained):
    pass
