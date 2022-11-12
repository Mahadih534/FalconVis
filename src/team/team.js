import { CalculatedStats } from '../lib/data/CalculatedStats.js';
import { StatMacro } from '../lib/components/StatMacro.js';
import { Queries, JSONData } from '../lib/data/Constants.js'
import { WeightedStat } from '../lib/automated/WeightedStat.js'
import { Factor } from '../lib/automated/Factor.js'

(async () => {
    var data = await fetch(JSONData).then(res => res.json())

    var stats = new CalculatedStats(data)

    var falconRank = new StatMacro(
        4099, 
        "macrosContainer", 
        {
            name: "FalconRank",
            formula: function (team) { return stats.getFalconRank(team) }
        }, 
        2
    )
    var uptime = new StatMacro(
        4099, 
        "macrosContainer", 
        {
            name: "Uptime",
            formula: function (team) { return stats.getAvrStat(team, Queries.UPTIME) }
        }, 
        0.5
    )
    var teleop_upper = new StatMacro(
        4099, 
        "macrosContainer", 
        {
            name: "Avr. Teleop Upper",
            formula: function (team) { return stats.getAvrStat(team, Queries.TELEOP_UPPER_HUB)}
        }, 
        15
    )
    var auto_upper = new StatMacro(
        4099, 
        "macrosContainer", 
        {
            name: "Avr. Auto Upper",
            formula: function (team) { return stats.getAvrStat(team, Queries.AUTO_UPPER_HUB)} 
        }, 
        2
    )
    var driver_rating = new StatMacro(
        4099, 
        "macrosContainer", 
        {
            name: "Driver Rating",
            formula: function (team) { return stats.getAvrStat(team, Queries.DRIVER_RATING) } 
        }, 
        2
    )
    var defense_rating = new StatMacro(
        4099, 
        "macrosContainer", 
        {
            name: "Defense Rating",
            formula: function (team) { return stats.getAvrStat(team, Queries.DEFENSE_RATING) }
        }, 
        2
    )

    var setTeams = function () {
        var team = document.getElementById("teams").value
        falconRank.team = team
        uptime.team = team
        teleop_upper.team = team
        auto_upper.team = team
        driver_rating.team = team
        defense_rating.team = team
    }

    

    setTeams()

    document.getElementById("teams").addEventListener("change", setTeams)

})()