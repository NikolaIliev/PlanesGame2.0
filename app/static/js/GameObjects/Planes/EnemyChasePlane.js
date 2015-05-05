define([
    "GameObjects/Planes/EnemyPlane",

    "Engine/Canvas",
    "Engine/InteractionManager",
    "Engine/Utility"
], function (EnemyPlane, Canvas, InteractionManager, Utility) {
    //an enemy plane with the added functionality to face the player

    return EnemyPlane.extend({
        init: function (left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height) {
            this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
            this.orientationDeg = 0;
        },

        orientationDeg: null,

        chasePlayer: function () {
            var playerLeft = InteractionManager.getPlayerLeftCoord(),
                playerBottom = InteractionManager.getPlayerBottomCoord();
            this.orientationDeg = Utility.getChaseAngle(this.leftCoord, this.bottomCoord, playerLeft, playerBottom);

            if (this.leftCoord > playerLeft) {
                this.orientationDeg *= -1;
            }
        },

        drawHpBar: function () {
            Canvas.beginPath();
            Canvas.set('fillStyle', 'red');
            Canvas.rect(-this.width / 2, (-this.height / 2) - 5, parseInt(this.width * (this.currentHealth / this.maxHealth)), 5);
            Canvas.fill();
            Canvas.beginPath();
            Canvas.set('lineWidth', 2);
            Canvas.rect(-this.width / 2, (-this.height / 2)  - 5, this.width, 5);
            Canvas.stroke();
        },

        move: function () {
            if (InteractionManager.getPlayerLeftCoord && InteractionManager.getPlayerBottomCoord && !this.isAnimated) {
                var playerLeft = InteractionManager.getPlayerLeftCoord(),
                    playerBottom = InteractionManager.getPlayerBottomCoord();
                Canvas.save();
                Canvas.translate(this.leftCoord + this.width / 2, this.bottomCoord + this.height / 2);
                if (this.bottomCoord > playerBottom) {
                    Canvas.rotate(Utility.degreeToRadian(this.orientationDeg));
                } else {
                    Canvas.rotate(Utility.degreeToRadian(180 - this.orientationDeg));
                }
                Canvas.drawImage(this.img, -this.width / 2, -this.height / 2);
                this.drawHpBar();
                Canvas.restore();
            } else {
                this._super();
            }
        }
    });
});