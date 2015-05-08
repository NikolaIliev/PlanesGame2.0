define([
    "GameObjects/Bullets/Bullet",

    "Engine/Canvas",
    "Engine/Scaling",
    "Engine/Utility"
], function (Bullet, Canvas, Scaling, Utility) {
    return Bullet.extend({
        initialize: function (left, bottom, orientationDeg, owner) {
            Bullet.prototype.initialize.call(this, left, bottom, orientationDeg, owner, 15, 4);
            this.set('bulletColor', '#fb2c00');
        },

        draw: function () {
            if (this.get('orientationDeg') != 0) {
                Canvas.save();
                Canvas.translate(this.get('leftCoord'), this.get('bottomCoord'));
                Canvas.rotate(Utility.degreeToRadian(180 - this.get('orientationDeg')));
                Canvas.beginPath();
                Canvas.set('fillStyle', this.get('bulletColor'));
                Canvas.rect(0, 0, this.get('height'), this.get('width'));
                Canvas.fill();
                Canvas.restore();
            } else {
                Bullet.prototype.draw.apply(this, arguments);
            }
        },

        move: function () {
            var bulletSpeed = 10,
                newLeftCoord = this.get('leftCoord') - (this.get('orientationDeg') / 45 * bulletSpeed),
                newBottomCoord = Math.floor((this.get('orientationDeg') > -90 && this.get('orientationDeg') < 90) ?
                        (this.get('bottomCoord') - (bulletSpeed * (1 - Math.abs(this.get('orientationDeg') / 90))))
                        : (this.get('bottomCoord') + (bulletSpeed * (1 - Math.abs(this.get('orientationDeg') / 90)))));

            this.updateCoords(newLeftCoord, newBottomCoord);
        },

        onIterate: function () {
            Bullet.prototype.onIterate.apply(this, arguments);

            this.move();
        }
    });
});