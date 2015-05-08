define([
    "backbone",
    "GameObjects/Bullets/BossBullet",
    "GameObjects/Bullets/FighterBullet",
    "GameObjects/Bullets/HealingBullet",
    "GameObjects/Bullets/HomingBullet",
    "GameObjects/Bullets/PiercingBullet",
    "GameObjects/Bullets/PlayerBullet"
], function (Backbone, BossBulletModel, FighterBulletModel, HealingBulletModel, HomingBulletModel,
             PiercingBulletModel, PlayerBulletModel) {
    var modelMapping = {
            "boss": BossBulletModel,
            "fighter": FighterBulletModel,
            "healing": HealingBulletModel,
            "homing": HomingBulletModel,
            "piercing": PiercingBulletModel,
            "player": PlayerBulletModel
        },
        BulletCollection = Backbone.Collection.extend({
            model: function (attributes, options) {
                return new modelMapping[attributes.type](attributes, options);
            }
        });

    return new BulletCollection();
});