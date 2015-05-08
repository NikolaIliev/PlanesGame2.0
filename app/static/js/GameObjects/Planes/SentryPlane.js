define([
    "GameObjects/Planes/AIPlane",

    "Engine/Canvas",
    "Engine/InteractionManager",
    "Engine/Utility"
], function (AIPlane, Canvas, InteractionManager, Utility) {
    return AIPlane.extend({
        init: function (left, bottom, maxHealth, damage) {
            var shootFrequency = 150, //ms
                width = 100,
                height = 75,
                type = "friendly";
            this._super(left, bottom, maxHealth, damage, shootFrequency, width, height, type);
            this.orientationDeg = 0;
            this.rotationDelta = 0;
            this.bulletType = "player";
            this.lastShootTimestamp = -1;
            this.rotate();
            this.setEvents();
        },
        img: $('<img src="app/static/images/planes/sentry.png"/>')[0],

        setEvents: function () {
            this.onKeyDownEvent = $(document).on('keydown', _.bind(this.onKeyDown, this));
            this.onKeyUpEvent = $(document).on('keyup', _.bind(this.onKeyUp, this));
        },

        unsetEvents: function () {
            $.off(this.onKeyDownEvent);
            $.off(this.onKeyUpEvent);
        },

        shoot: function () {
            if (this.tryShoot()) {
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + (this.orientationDeg / 90 + 1) * this.width / 2, this.bottomCoord + (this.height - Math.abs((this.orientationDeg / 90) * this.height / 2)), this.orientationDeg, this);
            }
        },

        drawHpBar: function () {
            Canvas.beginPath();
            Canvas.set('fillStyle', 'red');
            Canvas.rect(-this.width / 2, (-this.height / 2) - 5, this.width * (this.currentHealth / this.maxHealth), 5);
            Canvas.fill();
            Canvas.beginPath();
            Canvas.set('lineWidth', 2);
            Canvas.rect(-this.width / 2, (-this.height / 2) - 5, this.width, 5);
            Canvas.stroke();
        },

        rotate: function () {
            Canvas.save();
            Canvas.translate(this.leftCoord + this.width / 2, this.bottomCoord + this.height / 2);
            Canvas.rotate(Utility.degreeToRadian(-this.orientationDeg));
            Canvas.drawImage(this.img, -this.width / 2, -this.height / 2);
            this.drawHpBar();
            Canvas.restore();
        },

        rotateDeg: function () {
            this.orientationDeg += this.rotationDelta;
            if (this.orientationDeg < 0) {
                this.orientationDeg = 360 - this.orientationDeg;
            } else if (this.orientationDeg > 360) {
                this.orientationDeg -= 360;
            }
        },

        onKeyDown: function (e) {
            if (e.keyCode === 65) { // a
                this.rotationDelta = -3;
            } else if (e.keyCode === 68) { //d
                this.rotationDelta = 3;
            }
        },

        onKeyUp: function (e) {
            if (e.keyCode === 65 || e.keyCode === 68) { //a or d
                this.rotationDelta = 0;
            }
        }
    });
});