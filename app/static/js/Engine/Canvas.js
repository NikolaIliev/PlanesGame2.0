define([

], function () {
    var node = $('<canvas width="960" height="700" id="gameCanvas"></canvas>')[0],
        context = node.getContext('2d'),
        proxyFunctions = ["arc", "beginPath", "drawImage", "fill", "fillText", "rect", "restore", "rotate", "save", "scale", "stroke", "translate"],
        Canvas = {
            init: function () {
                $(node).appendTo("#gameScreen");
            },
            getContext: function () {
                return context;
            },
            "set": function () {
                var options = {};

                if (typeof arguments[0] === "string") {
                    options[arguments[0]] = arguments[1];
                } else if (typeof arguments[0] === "object") {
                    options = arguments[0];
                }
                _.each(options, function (value, key) {
                    context[key] = value;
                });
            }
        };

    //  ex: Canvas.translate(50, 1050) <=> Canvas.getContext().translate(50, 1050);
    _.each(proxyFunctions, function (functionName) {
        Canvas[functionName] = _.bind(context[functionName], context);
    });

    context.translate(0, 700);
    context.scale(1, -1);

    return Canvas;
});