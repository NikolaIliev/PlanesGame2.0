﻿var PreloadManager = {
    preloadQueue: [],
    percentageDone: 0,
    successCount: 0,
    errorCount: 0,
    addToQueue: function (path) {
        this.preloadQueue.push(path);
    },
    preloadAll: function (callback) {
        var i, currentElem, currentPath,
            self = this;
        for (i = 0; i < this.preloadQueue.length; i++) {
            currentPath = this.preloadQueue[i];
            currentElem = new Image();
            currentElem.addEventListener('load', function () {
                self.successCount++;
                self.updatePercentageDone();
                console.log('Loaded ' + currentPath);
                $('#loadingBar').css('width', self.percentageDone + '%');
                $('#loadingPercentage').text(self.percentageDone + '%');
                if (self.isDone()) {
                    callback();
                }
            });
            currentElem.addEventListener('error', function () {
                self.errorCount++;
                self.updatePercentageDone();
                $('#loadingBar').css('width', self.percentageDone + '%');
                $('#loadingPercentage').text(self.percentageDone + '%');
                console.log('Error preloading ' + self.preloadQueue[i]);
				Game.errorMessage('Error loading files');
				window.setTimeout(function () {
					location.reload();
				}, 2000);
                if (self.isDone()) {
                    callback();
                }
            });
            currentElem.src = this.preloadQueue[i];
        }
    },
    updatePercentageDone: function () {
        var total = this.preloadQueue.length,
            current = this.successCount + this.errorCount;
        this.percentageDone = Math.floor(current / total * 100);
    },
    isDone: function () {
        var done = this.successCount + this.errorCount == this.preloadQueue.length;
        console.log(this.successCount);
        console.log(this.errorCount);
        console.log(this.preloadQueue.length);
        console.log('---------');
        return done;
    }
};