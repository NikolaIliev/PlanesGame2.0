define([
    "Engine/InteractionManager",
    "GameObjects/Planes/AIPlane"
], function (InteractionManager, AIPlane) {
    return AIPlane.extend({
        initialize: function (left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height) {
            var type = "enemy";
            AIPlane.prototype.initialize.call(this, left, bottom, maxHealth, damage, shootFrequency, width, height, type);
            this.set({
                movementSpeed: movementSpeed,
                lastDirectionChangeTimestamp: -1
            });
            this.updateCoords(left, bottom);
            this.draw();
        },

        changeDirection: function () {
            if (Math.random() > 0.5) {
                this.set('movingRight', !this.get('movingRight'));
            } else {
                this.set('movingUp', !this.get('movingUp'));
            }
        },

        moveAtDirection: function () {
            if (this.get('movingRight') && this.get('leftCoord') < (960 - 95)) {
                this.set('leftCoord', this.get('leftCoord') + this.get('movementSpeed'));
            } else if (!this.get('movingRight') && this.get('leftCoord') > 3) {
                this.set('leftCoord', this.get('leftCoord') - this.get('movementSpeed'));
            }

            if (this.get('movingUp') && this.get('bottomCoord') < (700 - 70)) {
                this.set('bottomCoord', this.get('bottomCoord') + this.get('movementSpeed'));
            } else if (!this.get('movingUp') && this.get('bottomCoord') > (350)) {
                this.set('bottomCoord', this.get('bottomCoord') - this.get('movementSpeed'));
            }
        },

        die: function () {
            AIPlane.prototype.die.apply(this, arguments);

            if (parseInt(Math.random() * 100 + 1) <= this.get('healingOrbSpawnChance')) {
                InteractionManager.spawnHealingOrb(this.get('leftCoord') + (this.get('width') / 2 - 20), this.get('bottomCoord') + (this.get('height') / 2 - 20));
            }
        }
    });
});