define([
    "backbone",
    "collections/BulletCollection",
    "collections/PlaneCollection",
    "Engine/Canvas",
    "Engine/Game",
    "Engine/InteractionManager",
    "Engine/Utility"
], function (Backbone, BulletCollection, PlaneCollection, Canvas, Game,
             InteractionManager, Utility) {
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

            BulletCollection.each(function (bulletModel) {
                PlaneCollection.chain()
                    .filter(function (planeModel) {
                        return bulletModel
                            && planeModel.get('type') !== bulletModel.get('type')
                            && Utility.checkCollision(bulletModel, planeModel);
                    })
                    .each(function (planeModel) {
                        planeModel.takeDamage(bulletModel.get('damage'));
                        bulletModel.destroy();
                    });
            });

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