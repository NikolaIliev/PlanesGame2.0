﻿define([
    "GameObjects/Bullets/EnemyBullet"
], function (EnemyBullet) {
    return EnemyBullet.extend({
        init: function (left, bottom, orientationDeg, owner) {
            this._super(left, bottom, orientationDeg, owner, 15, 4);
        }
    })
});