define([
    "backbone",
    "Engine/Missions/BossMission",
    "Engine/Missions/DominationMission",
    "Engine/Missions/GauntletMission",
    "Engine/Missions/SurvivalMission"
], function (Backbone, BossMissionModel, DominationMissionModel, GauntletMissionModel, SurvivalMissionModel) {
    var modelMapping = {
            "boss": BossMissionModel,
            "domination": DominationMissionModel,
            "gauntlet": GauntletMissionModel,
            "survival": SurvivalMissionModel
        },
        MissionCollection = Backbone.Collection.extend({
        model: function (attributes, options) {
            return new modelMapping[attributes.type](attributes, options);
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