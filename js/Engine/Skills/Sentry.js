﻿﻿Sentry = Skill.extend({
    init: function (plane, index) {
        this._super("Sentry", plane, 1, 10000, "sentryIcon", index); //plane using the skill, duration, cooldown
    },

    activate: function () {
        this._super();
        InteractionManager.spawnSentry(this.plane.leftCoord, this.plane.bottomCoord);
    },

    deactivate: function () {
        this._super();
    }
});