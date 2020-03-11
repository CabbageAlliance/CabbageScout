from typing import List

from pydantic import Field, constr

from cabbagescout.abc import BaseModel, BaseRobot


class ScoutEntry(BaseRobot):
    scout_name: constr(strip_whitespace=True, min_length=2, max_length=64) = Field(
        ..., description="The name of the scouter"
    )

    scout_team: int = Field(..., ge=1, le=9999, description="The team of the scouter")

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

    timestamp: int = Field(
        ...,
        description="The exact unix timestamp the unique identifier was generated at",
    )


class ScoutEntryID(ScoutEntry):
    """Model of how scout entries are stored in the database"""

    entry_id: int = Field(..., description="The unique identifier for the scout entry")


class EntryPage(BaseModel):
    """One page of scout entries"""

    pages: int = Field(..., description="The total number of pages that can be queried")
    lastPage: bool = Field(..., description="Whether or not this page is the last page")
    entries: List[ScoutEntryID] = Field(
        ..., description="The list of scout entries on this page"
    )


class TeamData(BaseModel):
    class Scoring(BaseModel):
        """Average scoring during a part of the match"""

        uppergoal_scored: float = Field(
            ..., description="Average upper goal scored during the period"
        )
        uppergoal_rate: float = Field(
            ..., description="Average upper goal success rate as a percentage [0, 1]"
        )
        lowergoal_scored: float = Field(
            ..., description="Average lower goal scored during the period"
        )

    opr: float = Field(-32767, description="OPR from TBA. -32767 if TBA is unavailable.")
    auto_line_rate: float = Field(
        ...,
        description="The rate of crossing the initiation line during auto as a percentage [0, 1]",
    )
    climb_success_rate: float = Field(
        ...,
        description="The success rate (successes over attempts) of climb during endgame",
    )
    climb_speed: float = Field(
        ...,
        description="The average climb speed when climb is successful during endgame",
    )
    auto: Scoring = Field(..., description="Scoring rates during the autonomous period")
    teleop: Scoring = Field(..., description="Scoring rates during the teleop period")
    down_rate: float = Field(
        ..., description="Percentage of the time the robot dies during a match [0, 1]"
    )
    foul_rate: float = Field(
        ..., description="Percentage of the time the robot fouls during a match [0, 1]"
    )
    defense_rate: float = Field(
        ...,
        description="Percentage of the time the robot defends during a match [0, 1]",
    )
