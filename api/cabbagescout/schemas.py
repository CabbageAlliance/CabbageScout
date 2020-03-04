import json
from typing import Dict, NamedTuple

from pydantic import BaseModel, Field, constr


class ScoutEntry(BaseModel):
    match: int = Field(
        ..., ge=1, description="The match number of a single event of qualifiers"
    )
    team: int = Field(
        ..., ge=1, le=9999, description="The team number of the scouted team"
    )

    # Auto

    auto_crossed_line: bool = Field(
        ...,
        description="The robot exited the initiation line during the autonomous period",
    )
    auto_uppergoal_scored: int = Field(
        ...,
        ge=0,
        description="The total number of power cells scored in upper goal during autonomous period, both outer and inner",
    )
    auto_lowergoal_scored: int = Field(
        ...,
        ge=0,
        description="Number of power cells scored in lower goal during autonomous period",
    )
    auto_uppergoal_missed: int = Field(
        ...,
        ge=0,
        description="Number of shots during autonomous period to the upper goal that missed (did not give any points)",
    )

    # Teleop Power Cells

    teleop_uppergoal_scored: int = Field(
        ...,
        ge=0,
        description="The total number of power cells scored in upper goal during teleop period, both outer and inner",
    )
    teleop_lowergoal_scored: int = Field(
        ...,
        ge=0,
        description="Number of power cells scored in lower goal during teleop period",
    )
    teleop_uppergoal_missed: int = Field(
        ...,
        ge=0,
        description="Number of shots during teleop period to the upper goal that missed (did not give any points)",
    )

    # Teleop Control Panel

    rotation_control: bool = Field(
        ..., description="The robot rotated the control panel for ROTATION CONTROL"
    )
    position_control: bool = Field(
        ..., description="The robot rotated the control panel for POSITION CONTROL"
    )
    defending_time: float = Field(
        ...,
        ge=0,
        description="The amount of time (in seconds) spent playing defense on other teams (not actively scoring)",
    )

    # Endgame

    hang_attempted: bool = Field(
        ..., description="The team seemed to make an effort to perform the CLIMB task"
    )
    hang_succeeded: bool = Field(
        ...,
        description="The team was awarded points for their attempt at the CLIMB task",
    )
    hang_time: float = Field(
        ...,
        ge=0,
        description="The amount of time (in seconds) spent performing the CLIMB task",
    )
    hang_level: bool = Field(
        ...,
        description="The GENERATOR SWITCH was balanced at the end of the endgame period",
    )

    # Other

    driver_rating: int = Field(
        ..., ge=1, le=5, description='The "star rating" for the drivers\' skills'
    )
    down_time: float = Field(
        ...,
        ge=0,
        description="The amount of time (in seconds) a robot spent visibly disabled during a match",
    )
    comments: constr(strip_whitespace=True, max_length=512) = Field(
        ..., description="Additional scouter comments (multiline)"
    )
    received_foul: bool = Field(
        ..., description="The team received a foul during the match"
    )

    def json(self, **kwargs) -> Dict:
        return json.loads(super().json(**kwargs))


class ScoutEntryKey(NamedTuple):
    @classmethod
    def from_scoutentry(cls, entry: ScoutEntry):
        return cls(match=entry.match, team=entry.team)

    match: int
    team: int
