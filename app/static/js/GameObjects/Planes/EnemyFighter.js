define([
    "Engine/InteractionManager",
    "Engine/Skills/SpreadShot",
    "GameObjects/Planes/EnemyPlane"
], function (InteractionManager, SpreadShot, EnemyPlane) {
    //The generic enemy plane

    return EnemyPlane.extend({
        init: function (left, bottom, maxHealth, damage, movementSpeed) {
            var shootFrequency = 1500,
                width = 90,
                height = 72;
            this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
            this.bulletType = "fighter";
            this.changeDirection();
            this.skills = [new SpreadShot(this)];
            this.healingOrbSpawnChance = 10;
        },

        img: $('<img src="app/static/images/planes/fighter.png"/>')[0],

        shoot: function () {
            if (this.tryShoot()) {
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + this.width / 2, this.bottomCoord, 0, this);
            }
        }
    });
});