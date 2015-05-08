define([
    "GameObjects/GameObject",

    "Engine/Canvas"
], function (GameObject, Canvas) {
    return GameObject.extend({
        initialize: function (maxHealth, damage, shootFrequency, width, height, type) {
            GameObject.prototype.initialize.call(this, width, height);

            this.animationProps = {
                currentFrame: 0,
                    frames: 0,
                    //current values of supported animation properties
                    opacityCurrent: 1,
                    rotationCurrent: 0,
                    scaleCurrent: 1,
                    //target values of supported animation properties
                    opacityTarget: 1,
                    rotationTarget: 0,
                    scaleTarget: 1,
                    leftTarget: -1,
                    bottomTarget: -1,
                    //delta values of supported animation properties
                    opacityDelta: 0,
                    rotationDelta: 0,
                    scaleDelta: 0,
                    leftDelta: 0,
                    bottomDelta: 0
            };
            this.set({
                maxHealth: maxHealth,
                currentHealth: maxHealth,
                damage: damage,
                shootFrequency: shootFrequency,
                type: type,
                isAnimated: false,
                lastShootTimestamp: -1
            });
        },

        takeDamage: function (damage) {
            this.set('currentHealth', Math.max(0, this.get('currentHealth') - damage));
            this.updateHpBar();
        },

        receiveHeal: function (healingPoints) {
            this.set('currentHealth', Math.min(this.get('currentHealth') + healingPoints, this.get('maxHealth')));
            this.updateHpBar();
        },

        tryShoot: function () {
            var nowMs = Date.now(),
                canShoot = false;

            if (nowMs - this.get('lastShootTimestamp') > this.get('shootFrequency')) {
                this.set('lastShootTimestamp', nowMs);
                canShoot = true;
            }

            return canShoot;
        },

        drawHpBar: function () {
            Canvas.beginPath();
            Canvas.set('fillStyle', 'red');
            Canvas.rect(this.get('leftCoord'), this.get('bottomCoord') - 5, parseInt(this.get('width') * (this.get('currentHealth') / this.get('maxHealth'))), 5);
            Canvas.fill();
            Canvas.beginPath();
            Canvas.set('lineWidth', 2);
            Canvas.rect(this.get('leftCoord'), this.get('bottomCoord') - 5, this.get('width'), 5);
            Canvas.stroke();
        },

        draw: function () {
            if (!this.get('isAnimated')) {
                Canvas.drawImage(this.img, this.get('leftCoord'), this.get('bottomCoord'));
                this.drawHpBar();
            }
        }
    });
});