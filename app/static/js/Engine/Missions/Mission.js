define([
    "backbone",
    "Engine/Canvas",
    "Engine/Game",
    "Engine/InteractionManager"
], function (Backbone, Canvas, Game, InteractionManager) {
    var MissionModel = Backbone.Model.extend({
        initialize: function (enemySpawnFrequencyMs, areaIndex) {
            this.enemySpawnFrequencyMs = enemySpawnFrequencyMs;
            this.areaIndex = areaIndex;
            this.startTime = InteractionManager.getSeconds();
        },

        areaIndex: null,
        enemySpawnFrequencyMs: null,
        mainLoopInterval: null,
        startTime: null,
        startMission: function () {
            var self = this;

            Canvas.init();

            InteractionManager.spawnPlayer();
            $(document).on('dragstart', function (e) {
                e.preventDefault();
            });
            $(document).on('contextmenu', function (e) {
                e.preventDefault();
            });
            this.mainLoopInterval = window.setInterval(function () {
                self.mainLoop.call(self);
            }, 1000 / 60);

            this.set("active", true);
        },
        mainLoop: function () {
            this.trigger("iterate");

            if (this.checkWinConditions()) {
                this.trigger("win");
                this.endMission();
            }

            if (this.checkLossConditions()) {
                this.trigger("loss");
                this.endMission();
            }
        },

        endMission: function () {
            $(document).off(); //removes all event listeners
            window.clearInterval(this.mainLoopInterval);
            this.set("active", false);
        },
        checkWinConditions: function () { },
        checkLossConditions: function () { },
        updatePrimaryStatus: function() { }
    });

    return MissionModel;
});