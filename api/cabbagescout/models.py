from datetime import timedelta
from typing import Dict, List

from pydantic import BaseModel, Field


class PowerCells(BaseModel):
    uppergoal_score: int = Field(..., ge=0)
    lowergoal_score: int = Field(..., ge=0)
    uppergoal_missed: int = Field(..., ge=0)


class ControlPanel(BaseModel):
    rotation_control_time: timedelta
    position_control_time: timedelta


class Auto(BaseModel):
    crossed_line: bool
    power_cells: PowerCells


class Teleop(BaseModel):
    power_cells: PowerCells
    control_panel: ControlPanel
    time_defending: timedelta


class Endgame(BaseModel):
    climb_attempted: bool
    climb_succeeded: bool
    climb_time: timedelta
    climb_balanced: bool


class ScoutEntry(BaseModel):
    team: int = Field(..., ge=1, le=9999)
    auto: Auto
    teleop: Teleop
    endgame: Endgame
    driver_rating: int = Field(..., ge=1, le=5)
    time_dead: timedelta
    comments: str
    received_foul: bool


class Database(BaseModel):  # lmao, this is temporary, chillax
    def get_match(self, num: int) -> List[ScoutEntry]:
        return self.matches[num]

    matches: Dict[int, List[ScoutEntry]] = {}
