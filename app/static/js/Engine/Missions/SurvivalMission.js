define([
    "Engine/Missions/Mission",

    "Engine/Canvas",
    "Engine/InteractionManager"
], function (Mission, Canvas, InteractionManager) {
    return Mission.extend({
        init: function (areaIndex) {
            var enemySpawnFrequencyMs = 800;
            this._super(enemySpawnFrequencyMs, areaIndex);
        },

        checkWinConditions: function () {
            //A survival mission is 'won' if the player manages to survive for (45) seconds;
            var win = (InteractionManager.getSeconds() - this.startTime) >= 45;
            return win;
        },

        checkLossConditions: function () {
            //A survival mission is 'lost/failed' if the player dies
            var loss = (InteractionManager.getPlayerHealth()) == 0;
            return loss;
        },

        updatePrimaryStatus: function(past){
            var remainingTime = 45 - (InteractionManager.getSeconds() - this.startTime);
            remainingTime = (remainingTime >= 0) ? remainingTime : 0;
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
            Canvas.fillText('Survive for another', 655, 670);
            Canvas.set('font', '30px sans-serif');
            Canvas.fillText(remainingTime, 815, 670);
            Canvas.set('font', '18px sans-serif');
            Canvas.fillText('seconds', 855, 670);
            Canvas.restore();
        }
    });
});