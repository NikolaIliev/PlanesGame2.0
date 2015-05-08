define([
    "GameObjects/Planes/Plane",

    "Engine/Canvas",
    "Engine/InteractionManager",
    "collections/BulletCollection",
    "collections/MissionCollection",
    "Engine/Utility",
    "GameObjects/Bullets/PlayerBullet"
], function (Plane, Canvas, InteractionManager, BulletCollection, MissionCollection, Utility, PlayerBullet) {
    return Plane.extend({
        initialize: function () {
            var maxHealth = 100,
                damage = 1,
                shootFrequency = 120,
                width = 100,
                height = 80,
                type = "player";

            Plane.prototype.initialize.call(this, maxHealth, damage, shootFrequency, width, height, type);

            this.set({
                isShooting: false,
                isStealthed: false,
                skills: [],
                absorptionShieldStrength: 0,
                level: 1,
                stars: 0,
                type: "player",
                originalMoveFunction: this.move
            });

            this.setEvents();
        },

        img: $('<img src="app/static/images/planes/player.png"/>')[0],
        setEvents: function () {
            MissionCollection.on("change:active", _.bind(function (active) {
                if (active) {
                    this.onKeyPressEvent = $(document).on('keypress', _.bind(this.onKeyPress, this));
                    this.onMouseDownEvent = $(document).on('mousedown', _.bind(this.onMouseDown, this));
                    this.onMouseMoveEvent = $(document).on('mousemove', _.bind(this.onMouseMove, this));
                    this.onMouseUpEvent = $(document).on('mouseup', _.bind(this.onMouseUp, this));
                }
            }, this));
        },

        unsetEvents: function () {
            $.off(this.onKeyPressEvent);
            $.off(this.onMouseDownEvent);
            $.off(this.onMouseMoveEvent);
            $.off(this.onMouseUpEvent);
        },

        shoot: function () {
            if (this.get('isShooting') && this.tryShoot()) {
                BulletCollection.add(new PlayerBullet(this.get('leftCoord'), this.get('bottomCoord'), 0, this));
                //if (InteractionManager.getEnemiesCount() > 0 || InteractionManager.getCurrentMission().type === "boss")  {
                //    InteractionManager.spawnBullet(this.get('bulletType'), this.get('leftCoord') + this.get('width')/2, this.get('bottomCoord') + this.get('height'), 0, this);
                //} else {
                //    InteractionManager.spawnBullet("player", this.get('leftCoord') + this.get('width')/2, this.get('bottomCoord') + this.get('height'), 0, this);
                //}
            }
        },

        updateHpBar: function () {
            var currentHealthPercentage = parseInt(this.get('currentHealth') / this.get('maxHealth') * 100);
            $("#hpBar").css("width", currentHealthPercentage * 2 + "px");
        },

        stealthMove: function () {
            if (!this.get('isAnimated')) {
                Canvas.save();
                Canvas.set('globalAlpha', 0.5);
                Canvas.drawImage(this.img, this.get('leftCoord'), this.get('bottomCoord'));
                this.drawHpBar();
                Canvas.restore();
            }
        },

        shieldMove: function () {
            if (!this.get('isAnimated')) {
                Canvas.save();
                Canvas.set('globalAlpha', 0.5);
                Canvas.beginPath();
                Canvas.arc((this.get('leftCoord') + this.get('width')/2), (this.get('bottomCoord') + this.get('height')/2), this.get('width')/2, 0, 2 * Math.PI, false);
                Canvas.set('fillStyle', '#ffff66');
                Canvas.fill();
                Canvas.set('globalAlpha', 1);
                Canvas.drawImage(this.img, this.get('leftCoord'), this.get('bottomCoord'));
                this.drawHpBar();
                Canvas.restore();
            }
        },

        onMouseDown: function () {
            this.set('isShooting', true);
        },

        onMouseUp: function () {
            this.set('isShooting', false);
        },

        onMouseMove: function (e) {
            //substracting a half of the non-game screen
            var newCoords = (MissionCollection.getType() === "boss") ?
                Utility.convertEventCoordinatesBossMission(e.clientX, e.clientY) :
                Utility.convertEventCoordinates(e.clientX, e.clientY);

            newCoords.left -= 50; //adjust plane to cursor
            this.updateCoords(newCoords.left, newCoords.bottom);
        },

        onKeyPress: function (e) {
            var skillIndex;

            if (e.charCode >= "1".charCodeAt() && e.charCode <= "4".charCodeAt()) {
                skillIndex = e.charCode - "1".charCodeAt();

                if (this.get('skills')[skillIndex]) {
                    this.get('skills')[skillIndex].use();
                }
            }
        },

        onIterate: function () {
            this.shoot();
        }
    });
});