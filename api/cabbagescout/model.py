from datetime import timedelta
from typing import Dict

from pydantic import BaseModel


class Auto(BaseModel):
    crossed_line: bool
    uppergoal_score: int
    lowergoal_score: int


class PowerCells(BaseModel):
    uppergoal_score: int
    lowergoal_score: int
    uppergoal_misssed: int


class ControlPanel(BaseModel):
    rotation_control_time: timedelta
    position_control_time: timedelta


class Teleop(BaseModel):
    power_cells: PowerCells
    control_panel: ControlPanel
    time_defending: timedelta


class Endgame(BaseModel):
    climb_attempted: bool
    climb_suceeded: bool
    climb_time: timedelta
    climb_balanced: bool


class TeamMatch(BaseModel):
    num: int
    team: int
    auto: Auto
    teleop: Teleop
    endgame: Endgame
    driver_rating: int
    time_dead: timedelta
    comments: str
    recieved_foul: bool


class Database(BaseModel):  # lmao, this is temporary, chillax
    matches: Dict[int, TeamMatch] = {}
