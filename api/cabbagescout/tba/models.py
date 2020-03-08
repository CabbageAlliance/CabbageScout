from typing import Dict

from pydantic import Field

from cabbagescout.abc import BaseModel

__all__ = ("TeamKey", "EventKey", "API_Status", "Event_OPRS")


class TeamKey(str):
    """A team_key for tba. Ex: 'frc254' or 'frc6814'"""

    def __new__(cls, content):
        return str.__new__(cls, str(content).lower())

    @classmethod
    def from_team_number(cls, num: int):
        return cls(f"frc{num}")

    @property
    def number(self) -> int:
        return int(self[3:])

    def __eq__(self, other):
        if isinstance(other, int):
            return self.number == other

        return super().__eq__(other)

    def __ne__(self, other):
        return not self.__eq__(other)


class EventKey(str):
    """An event_key for tba. Ex: '2019CCC' or '2019CVR'"""

    def __new__(cls, content):
        return str.__new__(cls, str(content).lower())

    @classmethod
    def from_year_event(cls, year: int, name: str):
        return cls(f"{year}{name}")

    @property
    def year(self) -> int:
        return int(self[:4])

    @property
    def name(self) -> str:
        return self[4:]

    def __eq__(self, other):
        if not isinstance(other, str):
            return False

        return self.lower() == other.lower()

    def __ne__(self, other):
        return not self.__eq__(other)


class API_Status(BaseModel):
    """Returns API status, and TBA status information."""

    class API_Status_App_Version(BaseModel):
        min_app_version: int = Field(
            ...,
            description="Internal use - Minimum application version required to correctly connect and process data.",
        )
        latest_app_version: int = Field(
            ..., description="Internal use - Latest application version available."
        )

    current_season: int = Field(..., description="Year of the current FRC season.")
    max_season: int = Field(
        ..., description="Maximum FRC season year for valid queries."
    )
    is_datafeed_down: bool = Field(
        ..., description="True if the entire FMS API provided by FIRST is down."
    )
    ios: API_Status_App_Version
    android: API_Status_App_Version


class Event_OPRS(BaseModel):
    """OPR, DPR, and CCWM for teams at the event."""

    # maybe type alias this later?
    oprs: Dict[TeamKey, float] = Field(
        ...,
        description="A key-value pair with team key (eg `frc254`) as key and OPR as value.",
    )
    drps: Dict[TeamKey, float] = Field(
        ...,
        description="A key-value pair with team key (eg `frc254`) as key and DPR as value.",
    )
    ccwms: Dict[TeamKey, float] = Field(
        ...,
        description="A key-value pair with team key (eg `frc254`) as key and CCWMS as value.",
    )
