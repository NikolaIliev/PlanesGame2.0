﻿var PreloadManager = {
    preloadQueue: [],
    percentageDone: 0,
    successCount: 0,
    errorCount: 0,
    addToQueue: function (path) {
        this.preloadQueue.push(path);
    },
    preloadAll: function (callback) {
        var i, currentElem,
            self = this;
        for (i = 0; i < this.preloadQueue.length; i++) {
            currentElem = new Image();
            currentElem.addEventListener('load', function () {
                self.successCount++;
                self.updatePercentageDone();
                $('#loadingBar').css('width', self.percentageDone + '%');
                if (self.isDone()) {
                    callback();
                }
            });
            currentElem.addEventListener('error', function () {
                self.errorCount++;
                self.updatePercentageDone();
                $('#loadingBar').css('width', self.percentageDone + '%');
                console.log('Error preloading ' + self.preloadQueue[i]);
                if (self.isDone()) {
                    callback();
                }
            });
            currentElem.src = this.preloadQueue[i];
            console.log(currentElem);
        }
    },
    updatePercentageDone: function () {
        var total = this.preloadQueue.length,
            current = this.successCount + this.errorCount;
        this.percentageDone = Math.floor(current / total * 100);
    },
    isDone: function () {
        var done = this.successCount + this.errorCount == this.preloadQueue.length;
        return done;
    }
};