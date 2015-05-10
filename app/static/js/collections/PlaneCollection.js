define([
    "backbone",
    //"GameObjects/Planes/EnemyFighter",
    //"GameObjects/Planes/EnemyKamikaze",
    //"GameObjects/Planes/EnemyStormer",
    //"GameObjects/Planes/EnemySupplier",
    //"GameObjects/Planes/PlayerPlane",
    //"GameObjects/Planes/Sentry"
], function (Backbone) {//, EnemyFighterModel, EnemyKamikazeModel, EnemyStormerModel, EnemySupplierModel,
             //PlayerPlaneModel, SentryPlaneModel) {
    var modelMapping = {
            "fighter": "GameObjects/Planes/EnemyFighter",
            //"kamikaze": EnemyKamikazeModel,
            //"stormer": EnemyStormerModel,
            //"supplier": EnemySupplierModel,
            "player": "GameObjects/Planes/PlayerPlane"
            //"sentry": SentryPlaneModel
        },
        PlaneCollection = Backbone.Collection.extend({
            model: function (attributes, options) {
                return new (require(modelMapping[attributes.type]))(attributes, options);
            }
        });

    return new PlaneCollection();

    //return new (Backbone.Collection.extend({
    //    model: function () {
    //
    //    }
    //}))();
});