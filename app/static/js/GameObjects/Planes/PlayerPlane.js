define([
    "GameObjects/Planes/Plane",

    "Engine/Canvas",
    "Engine/InteractionManager",
    "Engine/Missions/MissionCollection",
    "Engine/Utility"
], function (Plane, Canvas, InteractionManager, MissionCollection, Utility) {
    return Plane.extend({
        init: function () {
            var maxHealth = 100,
                damage = 1,
                shootFrequency = 120,
                width = 100,
                height = 80,
                type = "player";
            this._super(maxHealth, damage, shootFrequency, width, height, type); //maxHealth, damage, shoot frequency, width, height
            this.isShooting = false;
            this.isStealthed = false;
            this.skills = [];
            this.absorptionShieldStrength = 0;
            this.level = 1;
            this.stars = 0;
            this.bulletType = "player";
            this.originalMoveFunction = this.move;

            this.setEvents();
        },

        img: $('<img src="app/static/images/planes/player.png"/>')[0],
        stars: null,
        level: null,
        absorptionShieldStrength: null,
        isShooting: null,
        isStealthed: null,
        originalMoveFunction: null,
        skills: null,
        setEvents: function () {
            MissionCollection.on("change:active", _.bind(function (active) {
                if (active) {
                    $(document).on('keypress', _.bind(this.onKeyPress, this));
                    $(document).on('mousedown', _.bind(this.onMouseDown, this));
                    $(document).on('mousemove', _.bind(this.onMouseMove, this));
                    $(document).on('mouseup', _.bind(this.onMouseUp, this));
                }
            }, this));
        },
        shoot: function () {
            if (this.isShooting && this.tryShoot()) {
                if (InteractionManager.getEnemiesCount() > 0 || InteractionManager.getCurrentMission().type === "boss")  {
                    InteractionManager.spawnBullet(this.bulletType, this.leftCoord + this.width/2, this.bottomCoord + this.height, 0, this);
                } else {
                    InteractionManager.spawnBullet("player", this.leftCoord + this.width/2, this.bottomCoord + this.height, 0, this);
                }
            }
        },

        updateHpBar: function () {
            var currentHealthPercentage = parseInt(this.currentHealth / this.maxHealth * 100);
            $("#hpBar").css("width", currentHealthPercentage * 2 + "px");
        },

        stealthMove: function () {
            if (!this.isAnimated) {
                Canvas.save();
                Canvas.set('globalAlpha', 0.5);
                Canvas.drawImage(this.img, this.leftCoord, this.bottomCoord);
                this.drawHpBar();
                Canvas.restore();
            }
        },

        shieldMove: function () {
            if (!this.isAnimated) {
                Canvas.save();
                Canvas.set('globalAlpha', 0.5);
                Canvas.beginPath();
                Canvas.arc((this.leftCoord + this.width/2), (this.bottomCoord + this.height/2), this.width/2, 0, 2 * Math.PI, false);
                Canvas.set('fillStyle', '#ffff66');
                Canvas.fill();
                Canvas.set('globalAlpha', 1);
                Canvas.drawImage(this.img, this.leftCoord, this.bottomCoord);
                this.drawHpBar();
                Canvas.restore();
            }
        },

        onMouseDown: function () {
            this.isShooting = true;
        },

        onMouseUp: function () {
            this.isShooting = false;
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

                if (this.skills[skillIndex]) {
                    this.skills[skillIndex].use();
                }
            }
        }
    });
});