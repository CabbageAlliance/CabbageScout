from datetime import timedelta
from typing import Dict

from pydantic import BaseModel, Field


class Auto(BaseModel):
    crossed_line: bool
    uppergoal_score: int = Field(..., ge=0)
    lowergoal_score: int = Field(..., ge=0)


class PowerCells(BaseModel):
    uppergoal_score: int = Field(..., ge=0)
    lowergoal_score: int = Field(..., ge=0)
    uppergoal_misssed: int = Field(..., ge=0)


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
    @classmethod
    def from_teammatchnum(cls, teammatchnum):
        return cls(**teammatchnum.dict())

    team: int = Field(..., ge=1, le=9999)
    auto: Auto
    teleop: Teleop
    endgame: Endgame
    driver_rating: int = Field(..., ge=1, le=5)
    time_dead: timedelta
    comments: str
    recieved_foul: bool


class TeamMatchNum(TeamMatch):
    @classmethod
    def from_teammatch(cls, teammatch, num):
        return cls(**teammatch.dict(), num=num)

    num: int = Field(..., ge=1)


class Database(BaseModel):  # lmao, this is temporary, chillax
    matches: Dict[int, TeamMatchNum] = {}
