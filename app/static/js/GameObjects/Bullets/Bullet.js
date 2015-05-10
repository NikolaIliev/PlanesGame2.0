define([
    "GameObjects/GameObject",

    "collections/BulletCollection",
    "collections/PlaneCollection",
    "Engine/Canvas",
    "Engine/Utility"
], function (GameObject, BulletCollection, PlaneCollection, Canvas, Utility) {
    return GameObject.extend({
        initialize: function () {
            GameObject.prototype.initialize.apply(this, arguments);

            this.set({
                toBeSpliced: false
            });
        },

        onIterate: function () {
            GameObject.prototype.onIterate.apply(this, arguments);

            if (this.get('bottomCoord') <= 70 || this.get('bottomCoord') > 700 || this.get('leftCoord') < 10 || this.get('leftCoord') > 947) {
                this.destroy();
            } else {
                this.checkCollision();
            }
        },

        checkCollision: function () {
            //PlaneCollection.chain()
            //    .filter(_.hitch(this, function (planeModel) {
            //        return planeModel.get('type') !== this.get('owner').get('type')
            //            && Utility.checkCollision(this, planeModel);
            //    }))
            //    .each(_.hitch(this, function (planeModel) {
            //        planeModel.takeDamage(this.get('owner').damage);
            //    }));
        },

        handleCollision: function () {
            this.set('toBeSpliced', true);
        },

        draw: function () {
            Canvas.beginPath();
            Canvas.set('fillStyle', this.get('bulletColor'));
            Canvas.rect(this.get('leftCoord'), this.get('bottomCoord'), this.get('height'), this.get('width'));
            Canvas.fill();
        },

        destroy: function () {
            GameObject.prototype.destroy.apply(this, arguments);
            BulletCollection.remove(this);
        }
    });
});