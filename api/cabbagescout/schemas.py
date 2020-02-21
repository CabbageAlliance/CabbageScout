import csv
import io
from collections import defaultdict
from datetime import timedelta
from itertools import chain
from typing import Dict, List, NamedTuple, get_type_hints

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

    # Teleop Power Cells

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

    # Teleop Control Panel

    rotation_control_time: float = Field(
        ...,
        ge=0,
        description="The amount of time (in seconds) spent rotating the control panel for ROTATION CONTROL",
    )
    position_control_time: float = Field(
        ...,
        ge=0,
        description="The amount of time (in seconds) spent rotating the control panel for POSITION CONTROL",
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
        ..., description="Additional scouter comments (multiline)",
    )
    received_foul: bool = Field(
        ..., description="The team received a foul during the match"
    )


class ScoutEntryKey(NamedTuple):
    @classmethod
    def from_scoutentry(cls, entry: ScoutEntry):
        return cls(match=entry.match, team=entry.team)

    match: int
    team: int


class Database:  # lmao, this is temporary, chillax
    def __init__(self):
        self.db: Dict[ScoutEntryKey, ScoutEntry] = defaultdict(list)

    def get_entries(self, key: ScoutEntryKey) -> List[ScoutEntry]:
        entries = ()

        if key.match is None:
            if key.team is None:
                entries = self.db.values()
            else:
                entries = (
                    self.db[_key] for _key in self.db.keys() if _key.team == key.team
                )
        else:
            if key.team is None:
                entries = (
                    self.db[_key] for _key in self.db.keys() if _key.match == key.match
                )
            else:
                return self.db[key]

        return list(chain.from_iterable(entries))

    def add_entry(self, entry: ScoutEntry):
        key = ScoutEntryKey.from_scoutentry(entry)
        self.db[key].append(entry)

        return key


def to_csv(entries: List[ScoutEntry]) -> str:
    DIALECT = csv.excel

    # This gets the name of all the fields
    # In Python 3.7, dictionaries are guaranteed to hold order
    # If this were to change, it's possible that the order of the keys will not be constant
    columns = get_type_hints(ScoutEntry).keys()

    buffer = io.StringIO()

    # Write human readable header, using the generated titles of the fields from pydantic

    schema = ScoutEntry.schema()["properties"]

    writer = csv.writer(buffer, dialect=DIALECT)
    writer.writerow(schema[column]["title"] for column in columns)

    # Write rows
    writer = csv.DictWriter(buffer, columns, dialect=DIALECT)
    writer.writerows(entry.dict() for entry in entries)

    return buffer.getvalue()
