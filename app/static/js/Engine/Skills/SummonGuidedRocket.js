define([
    "Engine/Skills/Skill",
    "Engine/InteractionManager"
], function (Skill, InteractionManager) {
    return Skill.extend({
        init: function (plane, index) {
            this._super("Guided Rocket", plane, 1, 10000, "guidedRocketIcon", index); //plane using the skill, duration, cooldown
        },

        activate: function () {
            if (!InteractionManager.isPlayerShooting()) {
                this._super();
                InteractionManager.handleGuidedRocket();
            }
        },

        deactivate: function () {
            this._super();
        }
    });
});