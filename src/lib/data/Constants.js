const Queries =  {
    HIGH: "HIGH_TIER",
    MID: "MID_TIER",
    HYBRID: "HYBRID_TIER",
    LEFT: "LEFT_GRID",
    RIGHT: "RIGHT_GRID",
    COOP: "COOP_GRID",
    DEFENSE_RATING: "DefenseRating",
    DRIVER_RATING: "DriverRating",
    DEFENSE_TIME: "DefenseTime",
    COUNTER_DEFENSE_RATING: "CounterDefenseRating",
    COUNTER_DEFENSE_TIME: "DefendedTime",
    ENDGAME_CRIT: {
        "None": 0,  //TODO: Edit scores
        "Parked": 0,
        "Docked": 2,
        "Engage": 10
    },
    ENGAGE_CRIT: {
        "None": 0,  //TODO: Edit scores
        "Parked": 0,
        "Docked": 0,
        "Engage": 1
    },
    TOTAL_ENDGAME: "EndgameFinalCharge",
    AUTO_TOTAL: {
        "auto_lower_hub": 2, 
        "auto_upper_hub": 4
    },
    AUTONOMOUS: "AUTONOMOUS",
    TELEOP: "TELEOP",
    AUTO_GRID: "AutoGrid",
    TELEOP_GRID: "TeleopGrid",
    AUTO_MISSES: "AutoMissed",
    TELEOP_MISSES: "TeleopMissed",
    AUTO_NOTES: "AutoNotes",
    TELEOP_NOTES: "TeleopNotes",
    ENDGAME_NOTES: "EndgameNotes",
    MOBILITY: "Mobile",
    DISABLED: "Disable",
    MOBILITY_CRIT: {
        1: 100, // TODO, change mobility and disable crit from true and false to 0 and 1 for CHCMP
        0: 0
    },
    DISABLED_CRIT: {
        1: 1, // TODO, change mobility and disable crit from true and false to 0 and 1 for CHCMP
        0: 0
    },
    AUTO_GRID_SCORE: {
        "L": 3,
        "M": 4,
        "H": 6
    },
    TELEOP_GRID_SCORE: {
        "L": 2,
        "M": 3,
        "H": 5
    }
}

const Selections =  {
    MATCHES: [
        'qm1', 'qm2', 'qm3', 'qm4', 'qm5', 
        'qm6', 'qm7', 'qm8', 'qm9', 'qm10', 
        'qm11', 'qm12', 'qm13', 'qm14', 'qm15', 
        'qm16', 'qm17', 'qm18', 'qm19', 'qm20', 
        'qm21', 'qm22', 'qm23', 'qm24', 'qm25', 
        'qm26', 'qm27', 'qm28', 'qm29', 'qm30', 
        'qm31', 'qm32', 'qm33', 'qm34', 'qm35', 
        'qm36', 'qm37', 'qm38', 'qm39', 'qm40', 
        'qm41', 'qm42', 'qm43', 'qm44', 'qm45', 
        'qm46', 'qm47', 'qm48', 'qm49', 'qm50', 
        'qm51', 'qm52', 'qm53', 'qm54', 'qm55', 
        'qm56', 'qm57', 'qm58', 'qm59', 'qm60'
    ],
    TEAMS: [
        116, 339, 612, 620, 623, 686, 1389, 1418, 
        1719, 1727, 1885, 1915, 2186, 2421, 2849, 2961, 2988, 
        3361, 3373, 3748, 3793, 4099, 4472, 4541, 4638, 5115, 
        5243, 5587, 5841, 6504, 6882, 7770, 8197, 8230, 8590, 8592,
        8726, 9033, 9072, 9235],
    RED: "red",
    BLUE: "blue"
}

const mandatoryMatchData = {
    MATCH_KEY: "MatchKey",
    ALLIANCE: "Alliance",
    TEAM_NUMBER: "TeamNumber",
    AUTO_GRID: "AutoGrid",
    TELEOP_GRID: "TeleopGrid"
}

const JSONData = "https://raw.githubusercontent.com/team4099/FalconScout/2023falconscoutcore/falconscoutcore/data/2023vaale_match_data.json"

export { Queries, Selections, JSONData, mandatoryMatchData }