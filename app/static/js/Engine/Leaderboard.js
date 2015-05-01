define([
    "Engine/Utility"
], function (Utility) {
    return {
        submitScore: function (name, score) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "http://bashibozuk.eu/games-score/?route=high-score/save-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&score=" + score + "&player=" + encodeURIComponent(name),
                    dataType: "jsonp",
                    data: {
                        format: "json"
                    },
                    success: function (response) {
                        resolve(score);
                    }
                });
            });

        },
        getHighscore: function () {
            return new Promise(_.hitch(this, function (resolve, reject) {
                $.ajax({
                    url: "http://bashibozuk.eu/games-score/?route=high-score/get-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&limit=15",
                    dataType: "jsonp",
                    data: {
                        format: "json"
                    },

                    success: _.hitch(this, function (response) {
                        resolve(this.convertResponse(response.data));
                    })
                });
            }));
        },
        getPosition: function (score) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: "http://bashibozuk.eu/games-score/?route=high-score/is-high-score&gameId=c4ca4238a0b923820dcc509a6f75849b&score=" + score,
                    dataType: "jsonp",
                    data: {
                        format: "json"
                    },
                    success: (function (response) {
                        resolve(response.data.position);
                    })
                });
            });
        },

        convertResponse: function (scores) { //converts the scores in the response array to time strings (mm:ss)
            return _.each(scores, function (data) {
                data.score = Utility.convertToTime(3600 - data.score);
            });
        }
    }
});