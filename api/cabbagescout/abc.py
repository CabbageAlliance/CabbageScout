import json
from typing import Dict

from pydantic import BaseModel as _BaseModel
from pydantic import Field
from pydantic.main import ModelMetaclass


class BaseModel(_BaseModel, metaclass=ModelMetaclass):
    def json(self, **kwargs) -> Dict:
        return json.loads(super().json(**kwargs))


class BaseRobot(BaseModel):
    """Base class for models representing robots in a match"""

    match: int = Field(
        ..., ge=1, description="The match number of a single event of qualifiers"
    )
    team: int = Field(
        ..., ge=1, le=9999, description="The team number of the scouted team"
    )
