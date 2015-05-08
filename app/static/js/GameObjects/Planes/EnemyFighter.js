define([
    "Engine/InteractionManager",
    "Engine/Skills/SpreadShot",
    "GameObjects/Planes/EnemyPlane",
    "GameObjects/Bullets/EnemyBullet"
], function (InteractionManager, SpreadShot, EnemyPlane, EnemyBullet) {
    //The generic enemy plane

    return EnemyPlane.extend({
        initialize: function (left, bottom, maxHealth, damage, movementSpeed) {
            var shootFrequency = 1500,
                width = 90,
                height = 72;
            EnemyPlane.prototype.initialize.call(this, left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);

            this.set({
                bulletType: "fighter",
                skills: [new SpreadShot(this)],
                healingOrbSpawnChance: 10
            });
            this.changeDirection();
        },

        img: $('<img src="app/static/images/planes/fighter.png"/>')[0],

        move: function () {
            var nowMs = Date.now();
            this.moveAtDirection();

            if (nowMs - this.get('lastDirectionChangeTimestamp') > 1000) { //  TODO: Config
                this.set('lastDirectionChangeTimestamp', nowMs);
                this.changeDirection();
            }
        },

        shoot: function () {
            if (this.tryShoot()) {
                debugger;
                new EnemyBullet(this.get('leftCoord') + this.get('width') / 2, this.get('bottomCoord'), 0, this);
            }
        },

        onIterate: function () {
            if (!this.isAnimated) {
                this.move();
                this.shoot();
            }
        }
    });
});