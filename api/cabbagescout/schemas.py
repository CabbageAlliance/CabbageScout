from datetime import timedelta
from typing import Dict, List

from pydantic import BaseModel, Field


class PowerCells(BaseModel):
    # The number of power cells scored in the upper goal
    # note: Not the total score from upper goal shots
    # note: Includes both inner and outer goal
    uppergoal_score: int = Field(..., ge=0)
    # The number of power cells scored in the lower goal
    lowergoal_score: int = Field(..., ge=0)
    # The number of shots to the upper goal that missed (did not give any points)
    uppergoal_missed: int = Field(..., ge=0)


class ControlPanel(BaseModel):
    # The amount of time spent rotating the control panel for ROTATION CONTROL
    rotation_control_time: timedelta
    # The amount of time spent rotating the control panel for POSITION CONTROL
    position_control_time: timedelta


class Auto(BaseModel):
    # Exited the initiation line during the autonomous period
    crossed_line: bool
    # The power cell data for scoring during the autonomous period
    power_cells: PowerCells


class Teleop(BaseModel):
    # The power cell data for scoring during the tele-operated period
    power_cells: PowerCells
    # The control panel data for a team during the tele-operated period
    control_panel: ControlPanel
    # The amount of time spent playing defense on other teams (not actively scoring)
    time_defending: timedelta


class Endgame(BaseModel):
    # The team seemed to make an effort to perform the CLIMB task
    climb_attempted: bool
    # The team was awarded points for their attempt at the CLIMB task
    climb_succeeded: bool
    # The amount of time spent performing the CLIMB task
    climb_time: timedelta
    # The GENERATOR SWITCH was balanced at the end of the endgame period
    climb_balanced: bool


class ScoutEntry(BaseModel):
    # The team number of the scouted team (int in [1, 9999])
    team: int = Field(..., ge=1, le=9999)
    # The autonomous data for that team during the match
    auto: Auto
    # The tele-operated data for that team during the match
    teleop: Teleop
    # The endgame data for that team during the match
    endgame: Endgame
    # The "star rating" for the drivers' skills (int in [1, 5])
    driver_rating: int = Field(..., ge=1, le=5)
    # The amount of time a robot spent visibly disabled during a match
    time_dead: timedelta
    # Additional scouter comments
    comments: str
    # The team received a foul during the match
    received_foul: bool


class Database(BaseModel):  # lmao, this is temporary, chillax
    def get_match(self, num: int) -> List[ScoutEntry]:
        return self.matches[num]

    matches: Dict[int, List[ScoutEntry]] = {}
