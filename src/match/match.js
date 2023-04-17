import { Queries, Selections, JSONData } from '../lib/data/Constants.js'
import { BarGraph } from '../lib/components/BarGraph.js';
import { LineGraph } from '../lib/components/LineGraph.js';
import { ScatterGraph } from '../lib/components/ScatterGraph.js';
import { PieGraph } from '../lib/components/PieGraph.js';
import { AutomatedMacro } from '../lib/components/AutomatedMacro.js';
import { WeightedStat } from '../lib/automated/WeightedStat.js'
import { CompositeStat } from '../lib/automated/CompositeStat.js'
import { Factor } from '../lib/automated/Factor.js'
import { CalculatedStats } from '../lib/data/CalculatedStats.js';
import { Modal } from "../lib/components/Modal.js"
import { GraphManager } from "../lib/components/GraphManager.js"
import { CombinedHeatmap } from "../lib/components/CombinedHeatmap.js"
import { 
    setTeams, modal, graphContainerBlue, 
    graphContainerRed, graphContainerComparison, red, blue 
} from './matchParent.js'


(async () => {
    var data = await fetch(JSONData).then(res => res.json())
    var stats = new CalculatedStats(data)

    // Shared Stats and Properties here
    var defenseStat = new WeightedStat(
        [{
            formula: new Factor(function(team) {return stats.getAvrStat(team, Queries.DEFENSE_RATING)}),
            weight: 10
        },
        {
            formula: new Factor(function(team) {return stats.getAvrStat(team, Queries.DRIVER_RATING)}),
            weight: 10
        },
        {
            formula: new Factor(function(team) {return stats.getAvrStat(team, Queries.COUNTER_DEFENSE_RATING)}),
            weight: 10
        }],
        4
    )

    generateBlueGraphs()
    generateRedGraphs()
    generateComparisonGraphs()
    
    // Red Graphs Generated Here
    function generateRedGraphs(){
        graphContainerRed.addGraph(
            "teleopCargoRed",
            new BarGraph(
                "redAllianceContainer",
                "Avr. Cycles Cargo - Red",
                {
                    bar: {
                        horizontal: false
                    }
                },
                {
                    formula: {
                    "Cycles": function(team) {return stats.getAvrStat(team, Queries.TELEOP_GRID)}
                    },
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        
        graphContainerRed.addGraph(
            "autoPOTRed",
            new LineGraph(
                "redAllianceContainer",
                "Auto POT - Red",
                {},
                {
                    formula: function(team) {return stats.getAvrGridScore(team, Queries.AUTONOMOUS)},
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerRed.addGraph(
            "autoChargeStationPOTRed",
            new LineGraph(
                "redAllianceContainer",
                "Auto Charge Station POT - Red",
                {},
                {
                    formula: function(team) { 
                        return stats.getScoreDataCrit(team, Queries.AUTO_CHARGING_STATE, Queries.AUTO_CHARGE_STATION_CRIT)
                    },
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        
        graphContainerRed.addGraph(
            "teleopPOTRed",
            new LineGraph(
                "redAllianceContainer",
                "Teleop POT - Red",
                {},
                {
                    formula: function(team) {return stats.getAvrGridScore(team, Queries.TELEOP)},
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerRed.addGraph(
            "auto CYCLES over time",
            new LineGraph(
                "redAllianceContainer",
                "Auto CYCLES over time - Red",
                {},
                {
                    formula: function(team) { return stats.getAvrStatOverTime(team, Queries.AUTO_GRID)},
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerRed.addGraph(
            "teleop CYCLES over time",
            new LineGraph(
                "redAllianceContainer",
                "Teleop CYCLES over time - Red",
                {},
                {
                    formula: function(team) { return stats.getAvrStatOverTime(team, Queries.TELEOP_GRID)},
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerRed.addGraph(
            "teleop CYCLES heatmap",
            new CombinedHeatmap(
                "redAllianceContainer",
                "Teleop CYCLES Heatmap (Combined) - Red",
                {},
                {
                    formula: function(team) { return stats.getCycleHeatmapData(team, Queries.TELEOP_GRID)},
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerRed.addGraph(
            "auto CYCLES heatmap",
            new CombinedHeatmap(
                "redAllianceContainer",
                "Auto CYCLES Heatmap (Combined) - Red",
                {},
                {
                    formula: function(team) { return stats.getCycleHeatmapData(team, Queries.AUTO_GRID)},
                    selectedOptions: red,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )
    }

// Blue Graphs Generated Here
    function generateBlueGraphs(){
        graphContainerBlue.addGraph(
            "teleopCargoBlue",
            new BarGraph(
                "blueAllianceContainer",
                "Avr. Cycles Cargo - Blue",
                {
                    bar: {
                        horizontal: false
                    }
                },
                {
                    formula: {
                    "Cycles": function(team) {return stats.getAvrStat(team, Queries.TELEOP_GRID)}
                    },
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerBlue.addGraph(
            "autoPOTBlue",
            new LineGraph(
                "blueAllianceContainer",
                "Auto POT - Blue",
                {},
                {
                    formula: function(team) {return stats.getAvrGridScore(team, Queries.AUTONOMOUS)},
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerBlue.addGraph(
            "autoChargeStationPOTBlue",
            new LineGraph(
                "blueAllianceContainer",
                "Auto Charge Station POT - Blue",
                {},
                {
                    formula: function(team) { 
                        return stats.getScoreDataCrit(team, Queries.AUTO_CHARGING_STATE, Queries.AUTO_CHARGE_STATION_CRIT)
                    },
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerBlue.addGraph(
            "teleopPOTRed",
            new LineGraph(
                "blueAllianceContainer",
                "Teleop POT - Blue",
                {},
                {
                    formula: function(team) {return stats.getAvrGridScore(team, Queries.TELEOP)},
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerBlue.addGraph(
            "auto CYCLES over time",
            new LineGraph(
                "blueAllianceContainer",
                "Auto CYCLES over time - Blue",
                {},
                {
                    formula: function(team) { return stats.getAvrStatOverTime(team, Queries.AUTO_GRID)},
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerBlue.addGraph(
            "teleop CYCLES over time",
            new LineGraph(
                "blueAllianceContainer",
                "Teleop CYCLES over time - Blue",
                {},
                {
                    formula: function(team) { return stats.getAvrStatOverTime(team, Queries.TELEOP_GRID)},
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerBlue.addGraph(
            "teleop CYCLES heatmap",
            new CombinedHeatmap(
                "blueAllianceContainer",
                "Teleop CYCLES Heatmap (Combined) - Blue",
                {},
                {
                    formula: function(team) { return stats.getCycleHeatmapData(team, Queries.TELEOP_GRID)},
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )

        graphContainerBlue.addGraph(
            "auto CYCLES heatmap",
            new CombinedHeatmap(
                "blueAllianceContainer",
                "Auto CYCLES Heatmap (Combined) - Blue",
                {},
                {
                    formula: function(team) { return stats.getCycleHeatmapData(team, Queries.AUTO_GRID)},
                    selectedOptions: blue,
                    allOptions: Selections.TEAMS
                },
                modal,
                false
            )
        )
    }

    // Graphs comparing the Red and Blue alliances here
    function generateComparisonGraphs() {
        let teamsInAlliances = {
            "Blue Alliance": function() { return blue },
            "Red Alliance": function() { return red }
        }
        let oppositeAlliance = {
            "Blue Alliance": function() { return red },
            "Red Alliance": function() { return blue },
        }
        let options = Object.keys(teamsInAlliances)

        // Macro graphs
        graphContainerComparison.addGraph(
            "predicted_scores",
            new AutomatedMacro(
                "macrosContainer", 
                "Predicted Scores", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let compositeStat = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getPointsAddedByMatch(team, true)
                        )
                        return Math.round(compositeStat.reduce((a, b) => a + b) / compositeStat.length)
                    })],
                    100.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false
            )
        )

        graphContainerComparison.addGraph(
            "maximum_scores",
            new AutomatedMacro(
                "macrosContainer", 
                "Maximum Possible Scores", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let scoresByTeam = [0, 0, 0].map((_, index) => stats.getPointsAddedByMatch(teamsInAlliances[alliance]()[index], true))
                        return Math.max(...scoresByTeam[0]) + Math.max(...scoresByTeam[1]) + Math.max(...scoresByTeam[2])
                    })],
                    100.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false
            )
        )
        
        graphContainerComparison.addGraph(
            "minimum_scores",
            new AutomatedMacro(
                "macrosContainer", 
                "Minimum Possible Scores", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let scoresByTeam = [0, 0, 0].map((_, index) => stats.getPointsAddedByMatch(teamsInAlliances[alliance]()[index], true))
                        return Math.min(...scoresByTeam[0]) + Math.min(...scoresByTeam[1]) + Math.min(...scoresByTeam[2])
                    })],
                    100.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false
            )
        )

        graphContainerComparison.addGraph(
            "25p_scores",
            new AutomatedMacro(
                "macrosContainer", 
                "25th Percentile (Bottom 25%) Scores", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let scoresByTeam = [0, 0, 0].map((_, index) => stats.getPointsAddedByMatch(teamsInAlliances[alliance]()[index], true))
                        return Math.round(
                            stats.quantileSorted(scoresByTeam[0], 0.25, value => value) 
                            + stats.quantileSorted(scoresByTeam[1], 0.25, value => value) 
                            + stats.quantileSorted(scoresByTeam[2], 0.25, value => value) 
                        )
                    })],
                    100.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false
            )
        )

        graphContainerComparison.addGraph(
            "75p_scores",
            new AutomatedMacro(
                "macrosContainer", 
                "75th Percentile (Top 25%) Scores", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let scoresByTeam = [0, 0, 0].map((_, index) => stats.getPointsAddedByMatch(teamsInAlliances[alliance]()[index], true))
                        return Math.round(
                            stats.quantileSorted(scoresByTeam[0], 0.75, value => value) 
                            + stats.quantileSorted(scoresByTeam[1], 0.75, value => value) 
                            + stats.quantileSorted(scoresByTeam[2], 0.75, value => value) 
                        )
                    })],
                    100.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false
            )
        )

        graphContainerComparison.addGraph(
            "total_auto_cycles",
            new AutomatedMacro(
                "macrosContainer", 
                "Average Total Auto Cycles", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let scoresByTeam = [0, 0, 0].map((_, index) => stats.getAvrStat(teamsInAlliances[alliance]()[index], Queries.AUTO_GRID))
                        return scoresByTeam.reduce((a, b) => parseFloat(a) + parseFloat(b))
                    })],
                    4.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false
            )
        )

        graphContainerComparison.addGraph(
            "total_teleop_cycles",
            new AutomatedMacro(
                "macrosContainer", 
                "Average Total Teleop Cycles", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let scoresByTeam = [0, 0, 0].map((_, index) => stats.getAvrStat(teamsInAlliances[alliance]()[index], Queries.TELEOP_GRID))
                        return scoresByTeam.reduce((a, b) => parseFloat(a) + parseFloat(b))
                    })],
                    9.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false
            )
        )
        
        graphContainerComparison.addGraph(
            "chance_of_winning",
            new AutomatedMacro(
                "macrosContainer", 
                "Chance of Winning", 
                new CompositeStat(
                    [new Factor(function (alliance) { 
                        let scoresByTeam = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getPointsAddedByMatch(team, true)
                        )
                        let otherAllianceScores = stats.calculateAllianceCompositeStat(
                            oppositeAlliance[alliance](), 
                            team => stats.getPointsAddedByMatch(team, true)
                        )  
                        var matchesPlayed = 0
                        var matchesWon = 0
                    
                        for (const ownScore of scoresByTeam) {
                            if (otherAllianceScores[matchesPlayed] == null) {
                                break
                            }

                            if (ownScore > otherAllianceScores[matchesPlayed]) {
                                matchesWon += 1
                            }

                            matchesPlayed += 1
                        }

                        return matchesWon / matchesPlayed * 100
                    })],
                    50.0,
                ),
                ["Blue Alliance", "Red Alliance"],
                false,
                true
            )
        )

        // Comparison graphs
        graphContainerComparison.addGraph(
            "auto cycles COMPARED",
            new LineGraph(
                "alliancesComparedContainer",
                "Total Auto CYCLES over time - Compared",
                {},
                {
                    formula: function(alliance) { 
                        let compositeStat = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getPointsAddedByMatch(team, false, true)
                        )
                        return [[...Array(compositeStat.length).keys()], compositeStat]
                    },
                    selectedOptions: options,
                    allOptions: options
                },
                modal,
                false,
                true
            )
        )

        graphContainerComparison.addGraph(
            "teleop CYCLES COMPARED",
            new LineGraph(
                "alliancesComparedContainer",
                "Total Teleop CYCLES over time - Compared",
                {},
                {
                    formula: function(alliance) { 
                        let compositeStat = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getAvrStatOverTime(team, Queries.TELEOP_GRID)[1]
                        )
                        return [[...Array(compositeStat.length).keys()], compositeStat]
                    },
                    selectedOptions: options,
                    allOptions: options
                },
                modal,
                false,
                true
            )
        )

        graphContainerComparison.addGraph(
            "auto POT COMPARED",
            new LineGraph(
                "alliancesComparedContainer",
                "Total Auto POT over time - Compared",
                {},
                {
                    formula: function(alliance) { 
                        let compositeStat = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getPointsAddedByMatch(team, false, true)
                        )
                        return [[...Array(compositeStat.length).keys()], compositeStat]
                    },
                    selectedOptions: options,
                    allOptions: options
                },
                modal,
                false,
                true
            )
        )

        graphContainerComparison.addGraph(
            "teleop POT COMPARED",
            new LineGraph(
                "alliancesComparedContainer",
                "Total Teleop POT over time - Compared",
                {},
                {
                    formula: function(alliance) { 
                        let compositeStat = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getPointsAddedByMatch(team, false, false, true)
                        )
                        return [[...Array(compositeStat.length).keys()], compositeStat]
                    },
                    selectedOptions: options,
                    allOptions: options
                },
                modal,
                false,
                true
            )
        )

        graphContainerComparison.addGraph(
            "endgame POT COMPARED",
            new LineGraph(
                "alliancesComparedContainer",
                "Endgame POT over time - Compared",
                {},
                {
                    formula: function(alliance) { 
                        let compositeStat = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getScoreDataCrit(team, Queries.TOTAL_ENDGAME, Queries.ENDGAME_CRIT)[1]
                        )
                        return [[...Array(compositeStat.length).keys()], compositeStat]
                    },
                    selectedOptions: options,
                    allOptions: options
                },
                modal,
                false,
                true
            )
        )

        graphContainerComparison.addGraph(
            "cumulative POT COMPARED",
            new LineGraph(
                "alliancesComparedContainer",
                "Cumulative POT over time - Compared",
                {},
                {
                    formula: function(alliance) { 
                        let compositeStat = stats.calculateAllianceCompositeStat(
                            teamsInAlliances[alliance](), 
                            team => stats.getPointsAddedByMatch(team, true)
                        )
                        return [[...Array(compositeStat.length).keys()], compositeStat]
                    },
                    selectedOptions: options,
                    allOptions: options
                },
                modal,
                false,
                true
            )
        )
    }

    document.getElementById("setTeams").addEventListener("click", setTeams)
})()