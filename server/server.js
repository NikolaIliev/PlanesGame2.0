var io = require('socket.io')(3000),
    _ = require('underscore'),
    BulletCollection = require('./collections/BulletCollection'),
    PlaneCollection = require('./collections/PlaneCollection');

io.on('connection', function (socket) {
    console.log('someone connected');
    socket.on('handshake', function (data) {
        mergeCollections(data);
    });

    socket.on('change-bullet', function (model) {
        console.log('change-bullet');
        var currentModel = BulletCollection.findWhere({_id: model._id});

        if (currentModel) {
            currentModel.set(model, { silent: true })
        } else {
            BulletCollection.add(model);
        }

        model.type = 'fighter';
        socket.broadcast.emit('change-bullet', model);
    });
    socket.on('remove-bullet', function (_id) {
        console.log('remove-bullet');
        var model = BulletCollection.findWhere({ _id: _id });

        if (model) {
            BulletCollection.remove(model);
            socket.broadcast.emit('remove-bullet', _id);
        }
    });
    socket.on('change-plane', function (model) {
        var currentModel = PlaneCollection.findWhere({_id: model._id});

        if (currentModel) {
            currentModel.set(model, { silent: true })
        } else {
            PlaneCollection.add(model);
        }

        model.type = 'fighter';
        socket.broadcast.emit('change-plane', model);
    });
    socket.on('remove-plane', function (_id) {
        console.log('remove-plane');
        var model = PlaneCollection.findWhere({ _id: _id });

        if (model) {
            PlaneCollection.remove(model);
            socket.broadcast.emit('remove-plane', _id);
        }
    });
});

function mergeCollections(data) {
    BulletCollection.add(data.bulletModels, { merge: true });
    PlaneCollection.add(data.planeModels, { merge: true });
}

console.log('socket.io listening on port 3000');