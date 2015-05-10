define([
    "backbone"
], function (Backbone) {
    var modelMapping = {
            "boss": "Engine/Missions/BossMission",
            "domination": "Engine/Missions/DominationMission",
            "gauntlet": "Engine/Missions/GauntletMission",
            "multiplayer": "Engine/Missions/MultiplayerMission",
            "survival": "Engine/Missions/SurvivalMission"
        },
        MissionCollection = Backbone.Collection.extend({
        model: function (attributes, options) {
            return new (require(modelMapping[attributes.type]))(attributes, options);
        },

        getType: function () {
            var model = this.findWhere({ active: true });

            if (model) {
                return model.get("type");
            }
        }
    });

    return new MissionCollection();
});