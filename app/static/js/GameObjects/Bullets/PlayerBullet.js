define([
    "GameObjects/Bullets/Bullet",

    "Engine/Canvas",
    "Engine/Utility"
], function (Bullet, Canvas, Utility) {
    return Bullet.extend({
        initialize: function () {
            Bullet.prototype.initialize.apply(this, arguments);

            this.set({
                width: 15,
                height: 4,
                bulletColor: '#fb2c00',
                type: 'player'
            });
        },

        draw: function () {
            if (this.get('orientationDeg') != 0) {
                Canvas.save();
                Canvas.translate(this.get('leftCoord'), this.get('bottomCoord'));
                Canvas.rotate(Utility.degreeToRadian(-this.get('orientationDeg')));
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
            var playerBulletsSpeed = 10,
                newLeftCoord = this.get('leftCoord') + this.get('orientationDeg') / 45 * playerBulletsSpeed, //if the degree is (45) or (-45), the bullet
                newBottomCoord = parseInt((this.get('orientationDeg') > -90 && this.get('orientationDeg') < 90) ?
                    (this.get('bottomCoord') + (playerBulletsSpeed * (1 - Math.abs(this.get('orientationDeg') / 90))))
                    : (this.get('bottomCoord') - (playerBulletsSpeed * (1 - Math.abs(this.get('orientationDeg') / 90)))));
            //will travel diagonally at (playerBulletsSpeed) speed
            this.updateCoords(newLeftCoord, newBottomCoord);
        },

        onIterate: function () {
            Bullet.prototype.onIterate.apply(this, arguments);

            this.move();
        }
    });
});