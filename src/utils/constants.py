"""Defines the constants for FalconVis."""

from enum import Enum

__all__ = [
    "Criteria",
    "EventSpecificConstants",
    "GeneralConstants",
    "GraphType",
    "Queries"
]


class GeneralConstants:
    """Year-agnostic constants that will remain the same between all events & years."""

    PICKLIST_FIELDS = [
        "Average Teleop Cycles",
        "Average Auto Cycles"
    ]
    SECONDS_TO_CACHE = 60 * 4
    PRIMARY_COLOR = "#EFAE09"
    AVERAGE_FOUL_RATE = 1.06

    # Color sequences
    RED_ALLIANCE_GRADIENT = ["#731111", "#b04949", "#ed8282", "#f5b3b3"]
    BLUE_ALLIANCE_GRADIENT = ["#0b2e61", "#355687", "#7da0d1", "#a8c1e3"]
    GOLD_GRADIENT = ["#ffbd4d", "#ff9000", "#dd5f00"]
    LEVEL_GRADIENT = ["#f44a53", "#ff8800", "#f4c717"]

    # Colors
    DARK_RED = "#450a0a"
    DARK_BLUE = "#172554"
    DARK_GREEN = "#052e16"

    # Game piece colors
    CONE_COLOR = PRIMARY_COLOR
    CUBE_COLOR = "#4F46E5"

    # General game constants
    TELEOP_TOTAL_TIME = (2 * 60 + 15)
    TELEOP_MINUS_ENDGAME = TELEOP_TOTAL_TIME - 20


class EventSpecificConstants:
    """Constants specific to an event."""

    EVENT_CODE = "2024vaash"
    EVENT_NAME = "Ashland"
    URL = f"https://raw.githubusercontent.com/team4099/ScoutingAppData/main/{EVENT_CODE}_match_data.json"
    PIT_SCOUTING_URL = (
        f"https://raw.githubusercontent.com/team4099/ScoutingAppData/main/{EVENT_CODE}_pit_scouting_data.csv"
    )
    PICKLIST_URL = "https://www.notion.so/team4099/42836f096b83453e8f284956799be386?v=a20940a6d4bb4e9bb233a6581c2bf65a"


class GraphType(Enum):
    """Enum class representing the different graph types (cycle contribution graphs / point contribution graphs)."""
    
    CYCLE_CONTRIBUTIONS = 0
    POINT_CONTRIBUTIONS = 1
    

class Queries:
    """Constants specific to fields in the scouting data."""

    # Constants relating to fields
    MATCH_KEY = "MatchKey"
    MATCH_NUMBER = "MatchNumber"
    TEAM_NUMBER = "TeamNumber"

    AUTO_SPEAKER = "AutoSpeaker"
    AUTO_AMP = "AutoAmp"
    LEFT_STARTING_ZONE = "AutoLeave"

    TELEOP_SPEAKER = "TeleopSpeaker"
    TELEOP_AMP = "TeleopAmp"
    TELEOP_TRAP = "TeleopTrap"

    PARKED_UNDER_STAGE = "Parked"
    CLIMBED_CHAIN = "ClimbStatus"
    HARMONIZED_ON_CHAIN = "Harmonized"
    CLIMB_SPEED = "ClimbSpeed"

    DRIVER_RATING = "DriverRating"
    DEFENSE_TIME = "DefenseTime"
    DEFENSE_SKILL = "DefenseSkill"
    COUNTER_DEFENSE_SKIll = "CounterDefenseSkill"
    DISABLE = "Disabled"

    # Alliance constants
    RED_ALLIANCE = "red"
    BLUE_ALLIANCE = "blue"

    # Modes
    AUTO = "Auto"
    TELEOP = "Teleop"

    # Custom graph keywords
    ONE_TEAM_KEYWORD = "Used for custom graphs with one team."
    THREE_TEAMS_KEYWORD = "Used for custom graphs with three teams."
    FULL_EVENT_KEYWORD = "Used for custom graphs with a full event."
    

class Criteria:
    """Criteria used in `CalculatedStats`."""

    # Autonomous criteria
    BOOLEAN_CRITERIA = {
        0: 0,
        "false": 0,
        1: 1,
        "true": 1,
        False: 0,
        True: 1
    }

    # Endgame Criteria
    CLIMBING_POINTAGE = {
        "Park": 2,
        "Dock": 6,
        "Engage": 10
    }

    # Ratings criteria
    DRIVER_RATING_CRITERIA = {
        "Very Fluid": 5,
        "Fluid": 4,
        "Average": 3,
        "Poor": 2,
        "Very Poor": 1
    }
    DEFENSE_TIME_CRITERIA = {
        "Very Often": 5,
        "Often": 4,
        "Sometimes": 3,
        "Rarely": 2,
        "Never": 1
    }
    BASIC_RATING_CRITERIA = {
        "Very Good": 5,
        "Good": 4,
        "Okay": 3,
        "Poor": 2,
        "Very Poor": 1
    }