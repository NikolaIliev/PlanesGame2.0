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
    //var modelMapping = {
    //        "fighter": EnemyFighterModel,
    //        "kamikaze": EnemyKamikazeModel,
    //        "stormer": EnemyStormerModel,
    //        "supplier": EnemySupplierModel,
    //        "player": PlayerPlaneModel,
    //        "sentry": SentryPlaneModel
    //    },
    //    PlaneCollection = Backbone.Collection.extend({
    //        model: function (attributes, options) {
    //            return new modelMapping[attributes.type](attributes, options);
    //        }
    //    });

    return new Backbone.Collection();
});