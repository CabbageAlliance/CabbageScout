import abc
import json
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from pydantic import BaseModel as _BaseModel
from pydantic import Field
from pydantic.main import ModelMetaclass

if TYPE_CHECKING:
    from .schemas import ScoutEntry


class BaseModel(_BaseModel, metaclass=ModelMetaclass):
    def json(self, **kwargs) -> Dict:
        return json.loads(super().json(**kwargs))


class BaseRobot(BaseModel):
    """Base class for models representing robots in a match"""

    match: int = Field(
        ..., ge=1, description="The match number of a single event of qualifiers"
    )
    team: int = Field(
        ..., ge=1, le=9999, description="The team number of the scouted team"
    )


class Database(metaclass=abc.ABCMeta):
    """An ABC representing a Database"""

    __slots__ = ()

    @abc.abstractmethod
    async def add_entry(self, entry: "ScoutEntry") -> Optional[Any]:
        raise NotImplementedError()

    @abc.abstractmethod
    async def get_entries(
        self, match: int = None, team: int = None
    ) -> List["ScoutEntry"]:
        raise NotImplementedError()

    @abc.abstractmethod
    async def to_csv(self, delimiter: str = ",") -> str:
        raise NotImplementedError()

    @abc.abstractmethod
    async def connect(self) -> None:
        raise NotImplementedError()

    @abc.abstractmethod
    async def close(self) -> None:
        raise NotImplementedError()
