﻿SurvivalMission = Mission.extend({
    init: function (areaIndex) {
        var enemySpawnFrequencyMs = 800;
        this._super(enemySpawnFrequencyMs, areaIndex);
    },

    checkWinConditions: function () {
        //A survival mission is 'won' if the player manages to survive for (45) seconds;
        var win = (interactionManager.getSeconds() - this.startTime) >= 45;
        return win;
    },

    checkLossConditions: function () {
        //A survival mission is 'lost/failed' if the player dies
        var loss = (interactionManager.getPlayerHealth()) == 0;
        return loss;
    },

    updatePrimaryStatus: function(past){
        var remainingTime = 45-(interactionManager.getSeconds() - this.startTime);
        $(".mainMissionName").html("Survive another <b>"+remainingTime+"</b> seconds.");

    }
});