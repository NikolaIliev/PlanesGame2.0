﻿//supplier doesn't shoot, instead buffing the fighters with spread shot
EnemySupplier = EnemyPlane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        this._super(left, bottom, maxHealth, damage, movementSpeed);
        this.image.src = 'images/planes/supplier.png';
		this.width = 100;
		this.height = 80;
        this.changeDirection();
        this.lastSupplyTimestamp = -1;
        this.healingOrbSpawnChance = 30;
    },
    lastSupplyTimestamp: null,

    supply: function (fighter) {
        fighter.image.src = 'images/planes/fighter_spreadshot.png';
        fighter.shoot = spreadShotEnemyShoot;
    }
});