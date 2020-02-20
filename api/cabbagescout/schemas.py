from datetime import timedelta
from typing import Dict, List, NamedTuple

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
        description="Did the robot exit the initiation line during the autonomous period?",
    )
    auto_uppergoal_score: int = Field(
        ...,
        ge=0,
        description="Total number of power cells scored in upper goal during autonomous period, both outer and inner",
    )
    auto_lowergoal_score: int = Field(
        ...,
        ge=0,
        description="Number of power cells scored in lower goal during autonomous period",
    )
    auto_uppergoal_missed: int = Field(
        ...,
        ge=0,
        description="Number of shots during autonomous period to the upper goal that missed (did not give any points)",
    )

    # Teleop

    teleop_uppergoal_score: int = Field(
        ...,
        ge=0,
        description="Total number of power cells scored in upper goal during teleoperated period, both outer and inner",
    )
    teleop_lowergoal_score: int = Field(
        ...,
        ge=0,
        description="Number of power cells scored in lower goal during teleoperated period",
    )
    teleop_uppergoal_missed: int = Field(
        ...,
        ge=0,
        description="Number of shots during teleoperated period to the upper goal that missed (did not give any points)",
    )

    # # The control panel data for a team during the tele-operated period
    # The amount of time spent rotating the control panel for ROTATION CONTROL
    rotation_control_time: timedelta
    # The amount of time spent rotating the control panel for POSITION CONTROL
    position_control_time: timedelta
    # The amount of time spent playing defense on other teams (not actively scoring)
    defending_time: timedelta

    # # # Endgame

    # The team seemed to make an effort to perform the CLIMB task
    hang_attempted: bool
    # The team was awarded points for their attempt at the CLIMB task
    hang_succeeded: bool
    # The amount of time spent performing the CLIMB task
    hang_time: timedelta
    # The GENERATOR SWITCH was balanced at the end of the endgame period
    hang_level: bool

    # # # Other

    # The "star rating" for the drivers' skills (int in [1, 5])
    driver_rating: int = Field(..., ge=1, le=5)
    # The amount of time a robot spent visibly disabled during a match
    down_time: timedelta
    # Additional scouter comments (multiline)
    comments: constr(strip_whitespace=True, max_length=512)
    # The team received a foul during the match
    received_foul: bool


class ScoutEntryKey(NamedTuple):
    @classmethod
    def from_scoutentry(cls, entry: ScoutEntry):
        return cls(match=entry.match, team=entry.team)

    match: int
    team: int


class Database(BaseModel):  # lmao, this is temporary, chillax
    def get_match(self, num: int) -> List[ScoutEntry]:
        return self.matches[num]

    matches: Dict[int, List[ScoutEntry]] = {}
