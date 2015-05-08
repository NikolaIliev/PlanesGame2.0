define([
    "GameObjects/Bullets/PlayerBullet",

    "Engine/Canvas",
    "Engine/Utility"
], function (PlayerBullet, Canvas, Utility) {
    return PlayerBullet.extend({
        init: function (left, bottom, orientationDeg, owner, targetPlane) {
            this._super(left, bottom, orientationDeg, owner, 15, 4);
            this.bulletColor = '#e5ff51';
            this.targetPlane = targetPlane;
        },

        chaseTarget: function () {
            if (this.targetPlane && this.targetPlane.currentHealth > 0) {
                this.orientationDeg = parseInt(Math.atan(
                    Math.abs(this.leftCoord - (this.targetPlane.leftCoord + (this.targetPlane.width / 2))) / Math.abs(this.bottomCoord - (this.targetPlane.bottomCoord + 35)))
                / (Math.PI / 180)); //measures the angle the bullet needs to rotate to face its target
                if (this.leftCoord > this.targetPlane.leftCoord + (this.targetPlane.width / 2)) {
                    this.orientationDeg *= -1;
                }
            }
        },

        removeTarget: function () {
            this.targetPlane = undefined;
            this.orientationDeg = 0;
        },

        draw: function () {
            if (this.targetPlane) {
                Canvas.save();
                Canvas.translate(this.leftCoord, this.bottomCoord);
                if (this.bottomCoord > this.targetPlane.bottomCoord + this.targetPlane.height / 2) {
                    Canvas.rotate(Utility.degreeToRadian(-(180 - this.orientationDeg)));
                } else {
                    Canvas.rotate(Utility.degreeToRadian(-this.orientationDeg));
                }

                Canvas.beginPath();
                Canvas.set('fillStyle', this.bulletColor);
                Canvas.rect(0, 0, this.height, this.width);
                Canvas.fill();
                Canvas.restore();
            } else {
                this._super();
            }
        }
    });
});