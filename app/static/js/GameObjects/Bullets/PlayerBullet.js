define([
    "GameObjects/Bullets/Bullet",

    "Engine/Canvas",
    "Engine/Utility"
], function (Bullet, Canvas, Utility) {
    return Bullet.extend({
        init: function (left, bottom, orientationDeg, owner) {
            this._super(left, bottom, orientationDeg, owner, 15, 4);
            this.bulletColor = '#fb2c00';
        },

        move: function () {
            if (this.orientationDeg != 0) {
                Canvas.save();
                Canvas.translate(this.leftCoord, this.bottomCoord);
                Canvas.rotate(Utility.degreeToRadian(-this.orientationDeg));
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