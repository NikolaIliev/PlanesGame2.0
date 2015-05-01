define([

], function () {
    return Class.extend({
        width: null,
        height: null,
        readyToMove: null,
        leftCoord: null,
        bottomCoord: null,
        div: null,

        init: function (width, height) {
            this.div = document.createElement('div');
            this.readyToMove = true;
            this.width = width;
            this.height = height;
        },

        updateCoords: function (left, bottom) {
            this.leftCoord = left;
            this.bottomCoord = bottom;
        }
    });
});