HealingBullet = PlayerBullet.extend({
    init: function (left, bottom, orientationDeg, owner) {
        this._super(left, bottom, orientationDeg, owner);
        this.div.className = "healingBulletDiv";
    }
});