define([
    "backbone",
    "collections/MissionCollection",
    "Engine/pubsub"
], function (Backbone, MissionCollection, pubsub) {
    return Backbone.Model.extend({
        initialize: function (width, height) {
            Backbone.Model.prototype.initialize.apply(this, arguments);

            this.set({
                width: width,
                height: height,
                readyToMove: true
            });

            MissionCollection.on("iterate", this.onIterate, this);
            pubsub.on("frame", this.onFrame, this);
        },

        updateCoords: function (left, bottom) {
            this.set({
                'leftCoord': Math.floor(left),
                'bottomCoord': Math.floor(bottom)
            });
        },

        destroy: function () {
            //console.trace();
            MissionCollection.off(null, null, this);
            pubsub.off(null, null, this);
            this.unsetEvents();
        },

        onFrame: function () {
            this.draw();
        },

        onIterate: function () {},
        unsetEvents: function () {}
    });
});