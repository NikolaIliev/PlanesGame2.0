define([
    "Engine/Missions/Mission",

    "Engine/Canvas",
    "Engine/InteractionManager"
], function (MissionModel, Canvas, InteractionManager) {
    return MissionModel.extend({
        initialize: function (areaIndex) {
            var enemySpawnFrequencyMs = -1;
            MissionModel.prototype.initialize.call(this, enemySpawnFrequencyMs, areaIndex);
        },

        startMission: function () {
            MissionModel.prototype.startMission.apply(this, arguments);
            InteractionManager.spawnBoss();
        },

        mainLoop: function () {
            var self = this;
            InteractionManager.iterateBullets('all');
            InteractionManager.iterateFriendlyPlanes();
            InteractionManager.iterateEnemyPlanes();
            InteractionManager.iterateHazards();
            InteractionManager.shootPlayerPlane();
            InteractionManager.handleBossIteration();

            if (self.checkWinConditions()) {
                InteractionManager.handleMissionWin();
                self.endMission();
            }

            if (self.checkLossConditions()) {
                InteractionManager.handleMissionLoss();
                self.endMission();
            }
        },

        checkWinConditions: function () {
            var win = (InteractionManager.getBossHealth() <= 0);
            return win;
        },

        checkLossConditions: function () {
            var loss = (InteractionManager.getPlayerHealth() <= 0);
            return loss;
        },

        updatePrimaryStatus: function () {
            var bossHealth = InteractionManager.getBossHealthPercentage();

            Canvas.save();
            Canvas.translate(0, 700);
            Canvas.scale(1, -1);
            Canvas.set({
                shadowOffsetX: 3,
                shadowOffsetY: 3,
                shadowBlur: 2,
                shadowColor: 'black',
                font: '18px sans-serif',
                fillStyle: 'white'
            });
            Canvas.fillText('Current boss health:', 635, 670);
            Canvas.set("font", '30px sans-serif');
            Canvas.fillText(bossHealth + '%', 800, 672);
            Canvas.restore();
        }
    });
});