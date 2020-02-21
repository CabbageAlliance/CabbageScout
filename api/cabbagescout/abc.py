import abc
from typing import List

from cabbagescout.schemas import ScoutEntry


class Database(metaclass=abc.ABCMeta):
    """An ABC representing a Database"""

    __slots__ = ()

    @abc.abstractmethod
    async def add_entry(self, entry: ScoutEntry) -> None:
        raise NotImplementedError(
            f"{self.__class__.__name__}.add_entry() not implemented."
        )

    @abc.abstractmethod
    async def get_entries(
        self, match: int = None, team: int = None
    ) -> List[ScoutEntry]:
        raise NotImplementedError(
            f"{self.__class__.__name__}.get_entries() not implemented."
        )

    @abc.abstractmethod
    async def to_csv(self, delimiter: str = ",") -> str:
        raise NotImplementedError(
            f"{self.__class__.__name__}.to_csv() not implemented."
        )
