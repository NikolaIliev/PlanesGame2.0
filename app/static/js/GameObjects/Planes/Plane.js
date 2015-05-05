define([
    "GameObjects/GameObject",

    "Engine/Canvas"
], function (GameObject, Canvas) {
    return GameObject.extend({
        init: function (maxHealth, damage, shootFrequency, width, height, type) {
            this._super(width, height);
            this.maxHealth = maxHealth;
            this.currentHealth = maxHealth;
            this.damage = damage;
            this.shootFrequency = shootFrequency;
            this.type = type;
            this.lastShootTimestamp = -1;
            this.isAnimated = false;
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
        },

        maxHealth: null,
        currentHealth: null,
        damage: null,
        shootFrequency: null,
        bulletType: null,
        lastShootTimestamp: null,
        isAnimated: null,
        animationProps: null,

        updateCoords: function (left, bottom) {
            this._super(left, bottom);
        },

        updateHpBar: function () {
        },

        takeDamage: function (damage){
            if(this.currentHealth > damage){
                this.currentHealth -= damage;
            } else {
                this.currentHealth = 0;
            }
            this.updateHpBar();
        },

        receiveHeal: function(healingPoints){
            if((this.currentHealth + healingPoints) >= this.maxHealth){
                this.currentHealth = this.maxHealth;
            } else {
                this.currentHealth += healingPoints;
            }
            this.updateHpBar();
        },

        tryShoot: function () {
            var nowMs = Date.now(),
                canShoot = false;

            if (nowMs - this.lastShootTimestamp > this.shootFrequency) {
                this.lastShootTimestamp = nowMs;
                canShoot = true;
            }

            return canShoot;
        },

        drawHpBar: function () {
            Canvas.beginPath();
            Canvas.set('fillStyle', 'red');
            Canvas.rect(this.leftCoord, this.bottomCoord - 5, parseInt(this.width * (this.currentHealth / this.maxHealth)), 5);
            Canvas.fill();
            Canvas.beginPath();
            Canvas.set('lineWidth', 2);
            Canvas.rect(this.leftCoord, this.bottomCoord - 5, this.width, 5);
            Canvas.stroke();
        },

        move: function () {
            if (!this.isAnimated) {
                Canvas.drawImage(this.img, this.leftCoord, this.bottomCoord);
                this.drawHpBar();
            }
        }
    });
});