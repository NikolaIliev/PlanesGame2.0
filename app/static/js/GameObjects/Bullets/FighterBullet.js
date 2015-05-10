define([
    "GameObjects/Bullets/EnemyBullet"
], function (EnemyBullet) {
    return EnemyBullet.extend({
        init: function (left, bottom, orientationDeg, damage) {
            this._super(left, bottom, orientationDeg, damage, 15, 4);
        }
    })
});