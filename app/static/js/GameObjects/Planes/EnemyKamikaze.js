﻿define([
    "GameObjects/Planes/EnemyChasePlane"
], function (EnemyChasePlane) {
    //the kamikaze doesn't shoot, instead attempts to crash his plane into the player's , inflicting massive damage

    return EnemyChasePlane.extend({
        init: function (left, bottom, maxHealth, damage, movementSpeed) {
            var shootFrequency = -1,
                width = 100,
                height = 80;
            this._super(left, bottom, maxHealth, damage, movementSpeed, shootFrequency, width, height);
            this.healingOrbSpawnChance = 30;
        },
        img: $('<img src="app/static/images/planes/kamikaze.png"/>')[0]
    });
});
