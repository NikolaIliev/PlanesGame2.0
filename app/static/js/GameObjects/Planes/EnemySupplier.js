define([
    "Engine/InteractionManager",
    "Engine/Utility",
    "GameObjects/Planes/EnemyPlane"
], function (InteractionManager, Utility, EnemyPlane) {
    //supplier doesn't shoot, instead buffing the fighters with spread shot
    return EnemyPlane.extend({
        init: function (left, bottom, maxHealth, damage, movementSpeed) {
            var shootFrequency = -1,
                width = 100,
                height = 80;
            this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
            this.changeDirection();
            this.lastSupplyTimestamp = -1;
            this.healingOrbSpawnChance = 30;
            this.suppliedFighters = [];
            this.supplyFrequencyMs = 1500;
        },
        img: $('<img src="app/static/images/planes/supplier.png"/>')[0],
        supplyFrequencyMs: null,
        lastSupplyTimestamp: null,
        suppliedFighters: null,

        spreadShotEnemyShoot: function () {
            if (this.tryShoot()) {
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, -15, this);
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 0, this);
                InteractionManager.spawnBullet(this.bulletType, this.leftCoord + 45, this.bottomCoord, 15, this);
            }
        },

        supply: function (fighter) {
            fighter.shoot = this.spreadShotEnemyShoot;
            fighter.img = $('<img src="app/static/images/planes/fighter_spreadshot.png" />')[0];
            this.suppliedFighters.push(fighter);
        }
    });
});