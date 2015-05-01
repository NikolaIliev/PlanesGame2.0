﻿define([
    "GameObjects/SpriteGameObject"
], function (SpriteGameObject) {
    return SpriteGameObject.extend({
        init: function (left, bottom, width, height) {
            this._super(left,bottom,width, height);
            this.updateCoords(left, bottom);
        }
    });
});