﻿define([
    "Engine/Skills/Skill",
    "Engine/InteractionManager"
], function (Skill, InteractionManager) {
    return Skill.extend({
        init: function (plane, index) {
            this._super("Death Ray", plane, 1, 6000, "deathRayIcon", index); //plane using the skill, duration, cooldown
        },

        activate: function () {
            this._super();
            InteractionManager.handleDeathRay(this.plane.leftCoord, this.plane.bottomCoord);
        },

        deactivate: function () {
            this._super();
        }
    });
});