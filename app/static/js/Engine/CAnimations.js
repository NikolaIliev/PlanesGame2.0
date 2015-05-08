define([
    "Engine/Canvas",
    "Engine/Utility"
], function (Canvas, Utility) {
    return {
        animatedObjects: [],
        iterate: function () {
            var i;
            for (i = 0; i < this.animatedObjects.length; i++) {
                this.animationStep(this.animatedObjects[i]);
                if (this.animatedObjects[i].get('isAnimated') == false) {
                    this.animatedObjects.splice(i, 1);
                    i--;
                }
            }
        },
        animate: function (obj, properties) {
            return new Promise(_.hitch(this, function (resolve, reject) {
                var dur = properties.duration;
                obj.set('isAnimated', true);
                this.animatedObjects.push(obj);
                obj.resolve = resolve;
                obj.animationProps.frames = properties.frames;
                obj.animationProps.currentFrame = 0;
                obj.animationProps.opacityTarget = properties.opacity;
                obj.animationProps.rotationTarget = properties.rotation;
                obj.animationProps.scaleTarget = properties.scale;
                obj.animationProps.leftTarget = properties.left;
                obj.animationProps.bottomTarget = properties.bottom;
                obj.animationProps.opacityDelta = (obj.animationProps.opacityTarget - obj.animationProps.opacityCurrent) / obj.animationProps.frames;
                obj.animationProps.rotationDelta = (obj.animationProps.rotationTarget - obj.animationProps.rotationCurrent) / obj.animationProps.frames;
                obj.animationProps.scaleDelta = (obj.animationProps.scaleTarget - obj.animationProps.scaleCurrent) / obj.animationProps.frames;
                obj.animationProps.leftDelta = (obj.animationProps.leftTarget - obj.get('leftCoord')) / obj.animationProps.frames;
                obj.animationProps.bottomDelta = (obj.animationProps.bottomTarget - obj.get('bottomCoord')) / obj.animationProps.frames;
            }));
        },

        animationStep: function (obj) {
            obj.animationProps.currentFrame++;
            if (obj.animationProps.currentFrame == obj.animationProps.frames) {
                obj.set('isAnimated', false);
                this.resetAnimationProps(obj);
                obj.resolve();
                delete obj.resolve;
            } else {
                //update animation properties
                obj.animationProps.opacityCurrent += obj.animationProps.opacityDelta;
                obj.animationProps.rotationCurrent += obj.animationProps.rotationDelta;
                obj.animationProps.scaleCurrent += obj.animationProps.scaleDelta;
                obj.set('leftCoord', Math.floor(obj.get('leftCoord') + obj.animationProps.leftDelta));
                obj.set('bottomCoord', Math.floor(obj.get('bottomCoord') + obj.animationProps.bottomDelta));
                this.normalizeAnimationProps(obj);
            }
            this.updateCanvas(obj);
        },

        updateCanvas: function (obj) {
            Canvas.save();
            Canvas.set('globalAlpha', obj.animationProps.opacityCurrent);
            Canvas.translate(obj.get('leftCoord'), obj.get('bottomCoord'));
            Canvas.rotate(Utility.degreeToRadian(obj.animationProps.rotationCurrent));
            Canvas.drawImage(obj.img, 0, 0, obj.get('width') * obj.animationProps.scaleCurrent, obj.get('height') * obj.animationProps.scaleCurrent);
            Canvas.restore();
        },

        normalizeAnimationProps: function (obj) {
            if (obj.animationProps.opacityCurrent < 0) {
                obj.animationProps.opacityCurrent = 0;
            } else if (obj.animationProps.opacityCurrent > 1) {
                obj.animationProps.opacityCurrent = 1;
            }
            if (obj.animationProps.scaleCurrent < 0) {
                obj.animationProps.scaleCurrent = 0;
            } else if (obj.animationProps.scaleCurrent > 1) {
                obj.animationProps.scaleCurrent = 1;
            }
        },

        resetAnimationProps: function (obj) {
            obj.animationProps.opacityCurrent = obj.animationProps.opacityTarget;
            obj.animationProps.scaleCurrent = obj.animationProps.scaleTarget;
            obj.animationProps.rotationCurrent = obj.animationProps.rotationTarget;
        }
    };
});