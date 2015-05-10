define([
    "collections/BulletCollection",
    "Engine/InteractionManager",
    "Engine/Skills/SpreadShot",
    "Engine/Utility",
    "GameObjects/Planes/EnemyPlane",
    "GameObjects/Bullets/EnemyBullet"
], function (BulletCollection, InteractionManager, SpreadShot, Utility, EnemyPlane, EnemyBullet) {
    //The generic enemy plane

    return EnemyPlane.extend({
        initialize: function () {
            EnemyPlane.prototype.initialize.apply(this, arguments);

            this.set({
                leftCoord: Utility.getRandomLeftCoord(45),
                bottomCoord: Utility.getRandomBottomCoordTopHalf(35),
                maxHealth: 10,
                currentHealth: 10,
                damage: 1,
                movementSpeed: 10,
                skills: [new SpreadShot(this)],
                shootFrequency: 1500,
                width: 90,
                height: 72,
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
                BulletCollection.add({
                    type: 'fighter',
                    leftCoord: this.get('leftCoord') + this.get('width') / 2,
                    bottomCoord: this.get('bottomCoord'),
                    orientationDeg: 0,
                    damage: this.get('damage')
                });
            }
        },

        onIterate: function () {
            //if (!this.get('isAnimated')) {
            //    this.move();
            //    this.shoot();
            //}
        }
    });
});