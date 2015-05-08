define([
    "Engine/CAnimations",
    "GameObjects/Planes/Plane"
], function (CAnimations, Plane) {
    return Plane.extend({
        initialize: function (left, bottom, maxHealth, damage, shootFrequency, width, height, type) {
            Plane.prototype.initialize.call(this, maxHealth, damage, shootFrequency, width, height, type);
            this.set({
                leftCoord: left,
                bottomCoord: bottom
            });
            this.draw();
        },

        animateSpawn: function () {
            var rand = parseInt(Math.random() * 2),
                currentLeftCoord = this.get('leftCoord');

            switch (rand) {
                case 0:
                    this.set('leftCoord', 0); //plane comes from the left side
                    break;
                case 1:
                    this.set('leftCoord', 960); //plane comes from the right side
                    break;
                default:
                    throw new Error('Error generating a random number [0, 2]');
            }

            this.draw();

            this.animationProps.opacityCurrent = 0;
            CAnimations.animate(this, {
                opacity: 1,
                rotation: 0,
                scale: 1,
                left: currentLeftCoord,
                bottom: this.get('bottomCoord'),
                frames: 90
            });
        },

        takeDamage: function () {
            Plane.prototype.takeDamage.apply(this, arguments);

            if (!this.get('currentHealth')) {
                this.die();
            }
        },

        die: function () {
            CAnimations.animate(this, {
                opacity: 0,
                rotation: 179,
                scale: 0,
                left: this.get('leftCoord'),
                bottom: this.get('bottomCoord'),
                frames: 80
            });
            this.destroy();
        }
    });
});