define([

], function () {
    return  {
        getRandomLeftCoord: function (offsetWidth) {
            //returns a random number between (0 + offsetWidth) and (960 - offsetWidth)
            var randLeftNum = parseInt(Math.random() * (960 - 2 * offsetWidth)); //randLeftNum belongs to [offsetWidth, 960 - offsetWidth]
            return randLeftNum;
        },

        getRandomBottomCoordTopHalf: function (offsetHeight) {
            //returns a bottom coord in the top half of the screen
            var randBottNum = parseInt(Math.random() * (350 - offsetHeight) + 350);
            return randBottNum;
        },

        getRandomBottomCoordBottomHalf: function (offsetHeight) {
            //returns a bottom coord in the bottom half of the screen
            var randBottNum = parseInt(Math.random() * (280 - offsetHeight) + 70);
            return randBottNum;
        },

        getChaseAngle: function (chaserLeft, chaserBottom, targetLeft, targetBottom) {
            //always returns a positive number
            var angle;
            if (chaserBottom == targetBottom) {
                angle = 90;
            } else {
                angle = parseInt(Math.atan(
                    Math.abs(chaserLeft - targetLeft) / Math.abs(chaserBottom - targetBottom))
                / (Math.PI / 180));
            }

            return angle;
        },

        degreeToRadian: function (deg) {
            return deg * Math.PI / 180;
        },

        convertToTime: function (secondsInput) {
            var seconds = secondsInput % 60,
                minutes = Math.floor(secondsInput / 60),
                formattedSeconds = (seconds >= 10) ? seconds : ('0' + seconds),
                formattedMinutes = (minutes >= 10) ? minutes : ('0' + minutes),
                time = formattedMinutes + ':' + formattedSeconds;

            return time;
        },

        convertEventCoordinatesBossMission: function (clientX, clientY) {
            var converted = { left: 0, bottom: 0 };
            var nonGameScreenWidth = window.innerWidth - 960;
            //newLeft
            if (clientX > nonGameScreenWidth / 2 + 50) {
                //if mouse is inside the game screen
                if (clientX < (nonGameScreenWidth / 2 + 960) - 50) {
                    converted.left = clientX - (nonGameScreenWidth / 2);
                } else { //mouse is to the right of game screen
                    converted.left = 960 - 50;
                }
            } else { //mouse is to the left of game screen
                converted.left = 0 + 50;
            }
            //newBottom
            if (clientY >= 350 && clientY <= 570) {
                converted.bottom = 700 - clientY - 50;
                $('#gameScreen').css('cursor', 'none');
            } else if (clientY > 570) {
                converted.bottom = 80;
                $('#gameScreen').css('cursor', 'url(app/static/images/UI/pointerCursor.png), auto');
            } else {
                converted.bottom = 300;
                $('#gameScreen').css('cursor', 'url(app/static/images/UI/pointerCursor.png), auto');
            }

            return converted;
        },

        convertEventCoordinates: function (clientX, clientY, drawing) {
            var converted = { left: 0, bottom: 0 };
            var nonGameScreenWidth = window.innerWidth - 960;
            //newLeft
            if (clientX > nonGameScreenWidth / 2 + 50) {
                //if mouse is inside the game screen
                if (clientX < (nonGameScreenWidth / 2 + 960) - 50) {
                    converted.left = clientX - (nonGameScreenWidth / 2);
                } else { //mouse is to the right of game screen
                    converted.left = 960 - 50;
                }
            } else { //mouse is to the left of game screen
                converted.left = 0 + 50;
            }
            //newBottom
            if (clientY <= 570) {
                converted.bottom = 700 - clientY - 50;
                if ($('#gameScreen').css('cursor') != 'none' && !drawing) {
                    $('#gameScreen').css('cursor', 'none');
                }
            } else {
                if ($('#gameScreen').css('cursor') == 'none') {
                    $('#gameScreen').css('cursor', 'url(app/static/images/UI/pointerCursor.png), auto');
                }
                converted.bottom = 80;
            }

            converted.left = parseInt(converted.left);
            converted.bottom = parseInt(converted.bottom);

            return converted;
        }
    }
});