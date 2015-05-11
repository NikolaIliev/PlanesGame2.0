define([
    "collections/BulletCollection",
    "collections/PlaneCollection",
    "Engine/InteractionManager",
    "Engine/Missions/Mission",
    'socket.io'
], function (BulletCollection, PlaneCollection, InteractionManager, MissionModel, io) {
    return MissionModel.extend({
        initialize: function (areaIndex) {
            var enemySpawnFrequencyMs = 800;
            MissionModel.prototype.initialize.call(this, enemySpawnFrequencyMs, areaIndex);
        },

        startMission: function () {
            var ownId = PlaneCollection.findWhere({ type: "player" }).get('_id');
            MissionModel.prototype.startMission.apply(this, arguments);

            this.socket = io(prompt('Enter server ip:port') || 'http://localhost:3000');
            this.socket.on('change-bullet', function (model) {
                var currentModel = BulletCollection.findWhere({_id: model._id});

                if (!currentModel) {
                    currentModel = BulletCollection.add({ type: model.type }, { silent: true });
                }

                currentModel.set(model, { silent: true })
            });
            this.socket.on('remove-bullet', function (_id) {
                var model = BulletCollection.findWhere({ _id: _id });

                if (model) {
                    BulletCollection.remove(model, { silent: true });
                    model.destroy();
                }
            });
            this.socket.on('change-plane', function (model) {
                var currentModel = PlaneCollection.findWhere({_id: model._id});

                if (!currentModel) {
                    currentModel = PlaneCollection.add({ type: model.type }, { silent: true });
                }
                currentModel.set(model, { silent: true });

                if (model._id === ownId) {
                    currentModel.set('type', 'player', { silent: true });
                }
            });
            this.socket.on('remove-plane', function (_id) {
                var model = PlaneCollection.findWhere({ _id: _id });

                if (model) {
                    PlaneCollection.remove(model, { silent: true });
                    model.destroy();
                }
            });
            BulletCollection.on('add change', function (model) {
                this.socket.emit('change-bullet', model.toJSON());
            }, this);
            BulletCollection.on('remove', function (model) {
                this.socket.emit('remove-bullet', model.get('_id'));
            }, this);
            PlaneCollection.on('add change', function (model) {
                this.socket.emit('change-plane', model.toJSON());
            }, this);
            PlaneCollection.on('remove', function (model) {
                this.socket.emit('remove-plane', model.get('_id'))
            }, this);
        },

        checkWinConditions: function () {
            return false;
        },

        checkLossConditions: function () {
            //A survival mission is 'lost/failed' if the player dies
            var loss = (InteractionManager.getPlayerHealth()) == 0;
            return loss;
        }
    });
});