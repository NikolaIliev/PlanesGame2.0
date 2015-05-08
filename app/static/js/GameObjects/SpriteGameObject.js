define([
    "GameObjects/GameObject",

    "Engine/Canvas"
], function (GameObject, Canvas) {
    return GameObject.extend({
        initialize: function (left, bottom, width, height) {
            GameObject.prototype.initialize.call(this, width, height);

            this.lastSpriteChangeTimestampMs = -1;
            this.set({
                leftCoord: left,
                bottomCoord: bottom,
                spriteChangeFrequency: 50,
                currentFrame: 1
            })
        },

        drawSpriteFrame: function () {
            var nowMs = Date.now();

            if (nowMs - this.lastSpriteChangeTimestampMs > this.get('spriteChangeFrequency')) {
                this.lastSpriteChangeTimestampMs = nowMs;
                this.set('currentFrame', (this.get('currentFrame') < this.frameCount) ? (this.get('currentFrame') + 1) : 1);
            }
            Canvas.drawImage(this.get('img'), (this.get('currentFrame') - 1) * this.get('width'), 0, this.get('width'), this.get('height'), this.get('leftCoord'), this.get('bottomCoord'), this.get('width'), this.get('height'));
        }
    });
});