define([
    "GameObjects/GameObject",

    "Engine/Canvas"
], function (GameObject, Canvas) {
    return GameObject.extend({
        initialize: function (left, bottom, orientationDeg, owner, width, height) {
            GameObject.prototype.initialize.call(this, width, height);

            this.set({
                owner: owner,
                orientationDeg: orientationDeg,
                toBeSpliced: false
            });
            this.updateCoords(left, bottom);
        },

        onIterate: function () {
            GameObject.prototype.onIterate.apply(this, arguments);

            if (this.get('bottomCoord') <= 70 || this.get('bottomCoord') > 700 || this.get('leftCoord') < 10 || this.get('leftCoord') > 947) {
                this.destroy();
            }
        },

        handleCollision: function () {
            this.set('toBeSpliced', true);
        },

        draw: function () {
            Canvas.beginPath();
            Canvas.set('fillStyle', this.get('bulletColor'));
            Canvas.rect(this.get('leftCoord'), this.get('bottomCoord'), this.get('height'), this.get('width'));
            Canvas.fill();
        }
    });
});