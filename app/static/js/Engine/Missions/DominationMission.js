define([
    "Engine/Missions/Mission",

    "Engine/Canvas",
    "Engine/InteractionManager"
], function (Mission, Canvas, InteractionManager) {
    return Mission.extend({
        init: function (areaIndex) {
            var enemySpawnFrequencyMs = 600;
            this._super(enemySpawnFrequencyMs, areaIndex);
            this.currentDominationStartTime = this.startTime;
        },

        currentDominationStartTime: null,

        checkDominating: function () {
            return (InteractionManager.getEnemiesCount() <= 7);
        },

        resetDominationStartTime: function () {
            this.currentDominationStartTime = InteractionManager.getSeconds();
        },

        mainLoop: function () {
            if (!this.checkDominating()) {
                this.resetDominationStartTime();
            }
            InteractionManager.increaseSpawnTime();
            this._super();
        },

        checkWinConditions: function () {
            //A domination mission is 'won' if the player manages to dominate his enemies for (30) seconds;
            var win = (InteractionManager.getSeconds() - this.currentDominationStartTime) >= 30;
            return win;
        },

        checkLossConditions: function () {
            //A domination mission is 'lost/failed' if the player dies
            var loss = (InteractionManager.getPlayerHealth()) == 0;
            return loss;
        },
        updatePrimaryStatus: function () {
            var seconds = (30 - (InteractionManager.getSeconds() - this.currentDominationStartTime));
            seconds = (seconds >= 0) ? seconds : 0;

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
            Canvas.fillText('Keep the enemy count below 7 another', 635, 655);
            Canvas.set('font', '30px sans-serif');
            Canvas.fillText(seconds, 730, 685);
            Canvas.set('font', '18px sans-serif');
            Canvas.fillText('seconds', 770, 685);
            Canvas.restore();
        }
    });
});