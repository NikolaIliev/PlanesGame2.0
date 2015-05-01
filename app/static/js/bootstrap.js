define([
    "jquery",
    "Engine/Visual"
], function ($, Visual) {
    //window.addEventListener("load", function () {
    //    var i;
    //    Visual.drawLoadingScreen();
    //    for (i = 0; i < imgPaths.length; i++) {
    //        PreloadManager.addToQueue(imgPaths[i]);
    //    }
    //    PreloadManager.preloadAll(function () {
    //        $('<div id="effectScreen"> </div>').appendTo("#gameScreen");
    //        window.setTimeout(function () {
    //            $('#effectScreen').remove();
    //            Visual.drawIntroScreen();
    //        }, 1500);
    //    });
    //
    //    if (!requestAnimationFrame) {
    //        window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
    //        || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    //    }
    //});

    function init () {
        Visual.drawIntroScreen();
    }

    return {
        init: init
    }
});