define([
    "jquery",
    "Engine/CAnimations",
    "Engine/Canvas",
    "Engine/Game",
    "Engine/InteractionManager",
    "Engine/Leaderboard",
    "UserInterface/loadout",
    "exports"
], function ($, CAnimations, Canvas, Game, InteractionManager, Leaderboard, Loadout, exports) {
    _.extend(exports, {
        backgroundImg: null,
        backgroundPattern: null,
        uiImg: $('<img src="app/static/images/UI/UI.png" />')[0],

        drawLoadingScreen: function () {
            $('<div id="loadingBarOutline"> </div>')
                .css({
                    'position': 'absolute',
                    'top': 340,
                    'left': 230,
                    'width': 500,
                    'height': 20,
                    'border': '2px solid grey'
                })
                .appendTo('#gameScreen');
            $('<div id="loadingBar"> </div>')
                .css({
                    'position': 'absolute',
                    'text-align': 'center',
                    'height': '100%',
                    'width': '0%',
                    'background-color': 'white'
                })
                .appendTo('#loadingBarOutline');
            $('<span id="loadingPercentage"> </span>')
                .css({
                    'position': 'relative',
                    'left': -3,
                    'color': 'black',
                })
                .appendTo('#loadingBar');
        },

        drawIntroScreen: function () {
            $("<div id='introScreen'></div>")
                .css("background-image", "url(app/static/images/map/IntroScreen.png)")
                .appendTo("#gameScreen");

            if (localStorage.getItem('resumeAvailable') === 'true') {
                $("<div>Resume Game</div>")
                    .addClass("introButton")
                    .appendTo("#introScreen")
                    .on("click", _.hitch(this, function () {
                        InteractionManager.loadGame();
                        this.clearScreen();
                        this.drawMap();
                        this.drawGameObjects();
                        if (!Game.allUnlocked) {
                            this.updateStarsTracker();
                        }
                    }));
            }

            $("<div>New Game</div>")
                .addClass("introButton")
                .appendTo("#introScreen")
                .on("click", _.hitch(this, function () {
                    localStorage.setItem('resumeAvailable', 'false');
                    localStorage.setItem('saveData', '');
                    Game.init();
                    this.clearScreen();
                    this.drawMap();
                    this.drawGameObjects();
                    if (!Game.allUnlocked) {
                        this.updateStarsTracker();
                    }
                }));

            $("<div>Leaderboard</div>")
                .addClass("introButton")
                .appendTo("#introScreen")
                .on("click", _.hitch(this, function () {
                    Leaderboard.getHighscore().then(_.hitch(this, "drawLeaderBoard"));
                }));
        },

        //Draws the screen at the end of the game
        drawVictoryScreen:function(){
            $("<div/>")
                .addClass("victoryScreen gameWindow")
                .appendTo("#gameScreen");

            $("<div/>")
                .addClass("endGameArt")
                .appendTo(".victoryScreen");

            $("<div/>")
                .addClass("scoreSubmissionBox")
                .appendTo(".endGameArt");

            $("<input/>")
                .addClass("nameInput")
                .appendTo(".scoreSubmissionBox")

            //Used to submit the score. If the name entered doesnt exist or is over 15 characters, it won't post them.
            $("<div>Submit</div>")
                .addClass("submitButton")
                .appendTo(".scoreSubmissionBox")
                .on("click",function(){
                    if($(".nameInput").val().length>15 ||$(".nameInput").val().length<1){
                        Game.errorMessage("Enter a name under fifteen characters");
                        return;
                    }

                    // TODO: Implement with node.js REST service
                    Leaderboard.submitScore($(".nameInput").val(), InteractionManager.getVictoryTime())
                        .then(Leaderboard.getPosition)
                        .then(function (position) {
                            Leaderboard.getHighscore().then(_.hitch(this, function (highscore) {
                                $(".victoryScreen").remove();
                                this.drawLeaderBoard(highscore, position);
                            }));
                        });
                });
        },

        backgroundOffset: 0,

        //Makes the cursor invisible while game is active
        adjustCSSofGameScreen: function (isStartMission) {
            var backgrounds = ["river", "snow", "desert", "ocean"];

            if (isStartMission) {
                this.backgroundOffset = 0;
                this.backgroundImg = document.createElement('img');
                this.backgroundImg.src = 'app/static/images/backgrounds/' + backgrounds[Game.currentAreaIndex] + ".jpg";
            }
            else {
                $("#gameScreen").css({
                    "cursor": "url(app/static/images/UI/pointerCursor.png),auto",
                    "background-image": "none"
                });
            }
        },

        //Moves the background
        iterateBackground: function () {
            var self = this;
            this.backgroundOffset++;
            if (this.backgroundOffset >= 1400) {
                Canvas.drawImage(self.backgroundImg, 0, 700 - (this.backgroundOffset - 1400));
            }
            if (this.backgroundOffset >= 2100) {
                this.backgroundOffset = 0;
            }
            Canvas.drawImage(self.backgroundImg, 0, -this.backgroundOffset);
        },


        crossOutSecondaries: function (stat) {
            var conditions;
            function greaterThan(a, b) {
                return a > b;
            };
            function lessThanOrEqual(a, b) {
                return a <= b;
            };
            function comparer() { };
            switch (InteractionManager.getSecondaryMission()) {
                case "accuracy":
                    conditions = [25, 35, 50];
                    comparer = greaterThan;
                    break;
                case "remainingHealth":
                    conditions = [25, 50, 75];
                    comparer = greaterThan;
                    break;
                case 'usedSkills':
                    conditions = [9, 7, 5];
                    comparer = lessThanOrEqual;
                    break;
                default:
                    break;
            }
            for (var i = 0; i < conditions.length; i++) {
                if (comparer(conditions[i], stat)) {
                    $("#listItem" + i).addClass("uncompletedSecondary");
                }
                else {
                    $("#listItem" + i).removeClass("uncompletedSecondary");
                }
            }
        },

        setSecondaryDescriptions: function () {
            var conditions, i;
            switch (InteractionManager.getSecondaryMission()) {
                case "accuracy":
                    conditions = [25, 35, 50];
                    for (i = 0; i < conditions.length; i++) {
                        $("#listItem" + i).text("Keep your accuracy above " + conditions[i] + "%");
                    }
                    break;

                case "remainingHealth":
                    conditions = [25, 50, 75];
                    for (i = 0; i < conditions.length; i++) {
                        $("#listItem" + i).text("Keep your health above " + conditions[i] + "%");
                    }
                    break;
                case 'usedSkills':
                    conditions = [9, 7, 5];
                    for (i = 0; i < conditions.length; i++) {
                        $("#listItem" + i).text("Use your skills less than " + conditions[i] + "times");
                    }
                    break;

            }
        },

        //Draws the user interface during missions
        drawUI: function (mission) {

            $("<ul/>")
                .addClass("missionList")
                .appendTo("#gameScreen");

            if(mission.get("type") !== "boss"){
                for (var i = 0; i < 3; i++) {
                    $("<li/>")
                        .attr("id", "listItem" + i)
                        .addClass("secondaryListItem").
                        appendTo(".missionList");
                }

                this.setSecondaryDescriptions();
            }

            $("<div/>")
                .addClass("ui")
                .appendTo("#gameScreen");

            //Draw timer
            $('<div id="timer">' + InteractionManager.getTime() + '</div>')
                .addClass("inGame")
                .appendTo('.ui');

            //Draws the HP bar
            $("<div/>", {
                id: "hpBar"
            })
                .appendTo(".ui");
            var skillArray = InteractionManager.getPlayerSkills();
            for (var i = 0; i < 4; i++) {
                $("<div/>", {
                    id: "skill" + i
                })
                    .addClass("skills")
                    .appendTo(".ui");
                //Places correct icons
                if (skillArray[i] == undefined) { return; }
                else {
                    $("#skill" + i).addClass(skillArray[i].icon);
                }
            }

        },

        redrawUI: function () {
            Canvas.drawImage(this.uiImg, 0, 0);
        },

        //Make a skill's icon grey
        cooldownIcon: function (icon) {
            $("." + icon).css("background-image", "url(app/static/images/UI/" + icon + "CD.png)");
        },

        activateIcon: function (icon) {
            $("." + icon).css("background-image", "url(app/static/images/UI/" + icon + ".png)");
        },

        animateDuration: function (icon, durationMs) {
            $('<div></div>')
                .css({
                    'position': 'absolute',
                    'bottom': 0,
                    'left': 0,
                    'width': 50,
                    'height': 50,
                    'background-color': 'green',
                    'opacity': 0.5
                })
                .appendTo($('.' + icon))
                .animate({
                    'height': 0
                }, {
                    duration: durationMs,
                    complete: function () {
                        $(this).remove();
                    }
                });
        },

        animateCooldown: function (icon, cooldownMs) {
            $('<div></div>')
                .css({
                    'position': 'absolute',
                    'bottom': 0,
                    'left': 0,
                    'width': 50,
                    'height': 0,
                    'background-color': 'red',
                    'opacity': 0.5
                })
                .appendTo($('.' + icon))
                .animate({
                    'height': 50
                }, {
                    duration: cooldownMs,
                    complete: function () {
                        $(this).remove();
                    }
                });
        },

        //Creates the black hole animation
        drawBlackHole: function (left, bottom) {
            $("<div/>")
                .addClass("blackHole")
                .css({
                    "left": left - 200,
                    "bottom": bottom - 200
                })
                .appendTo("#gameScreen");

            setTimeout(function () { $('.blackHole').remove() }, 500);
        },
        //Creates the leaderboard
        drawLeaderBoard: function (topArray, playerPosition) {
            var leaderboardWindow = $("<div/>").addClass("gameWindow leaderboardWindow"), topFifteen;
            $("<div/>", { "id": "GamePromptScreen" }).appendTo("#gameScreen")

            $("<table/>")
                .addClass("leaderboard")
                .appendTo(leaderboardWindow)

            leaderboardWindow.appendTo("#GamePromptScreen")

            for (var i = 0; i < 15; i++) {
                if (topArray[i]) {
                    var tableRow = $("<tr/>");
                    $("<td/>").addClass("positionCell").text(i+1).appendTo(tableRow);
                    $("<td/>").addClass("nicknameCell").text(topArray[i].player).appendTo(tableRow);
                    $("<td/>").addClass("scoreCell").text(topArray[i].score).appendTo(tableRow);
                    tableRow.appendTo(".leaderboard")
                }
            }

            //If called with the arguement false instead of a numeric player position, it will just make a close button;
            if (!playerPosition) {
                $("<div id='closePrompt'>X<div/>")
                    .on("click", function () {
                        $("#GamePromptScreen").remove();
                    })
                    .appendTo(".leaderboardWindow");
                return;
            }

            topFifteen = (playerPosition < 14) ? "Congratulations! You are among the top fifteen players in the world!" : "You ranked at position " + playerPosition + ".</br> Think you can get in the top fifteen?";

            $("<div/>").html(topFifteen).addClass("leaderboardText").appendTo(".leaderboardWindow");

            $("<div>Replay</div>").addClass("replayButton").appendTo(".leaderboardWindow").on("click", function () { location.reload() });

        },

        drawGameObjects: function () {
            requestAnimationFrame(_.hitch(this, "drawGameObjects"));
            if (InteractionManager.getCurrentMission()) {
                Canvas.clearRect(0, 0, 960, 700);
                this.iterateBackground();
                CAnimations.iterate();
                this.redrawUI();
                InteractionManager.updatePrimaryStatus();
                InteractionManager.redrawGameObjects();
            }
        },

        updateStarsTracker: function () {
            var starsToLevelUp = InteractionManager.getStarsToLevelUp(),
                playerLevel = InteractionManager.getPlayerLevel(),
                starHtml = '<img src="app/static/images/map/starMini.png" />',
                starsEarnedHtml =starHtml+ InteractionManager.getPlayerStars() + ' earned',
                starsToNextLevelHtml =  starHtml + ((starsToLevelUp[playerLevel - 1]) ?
                        starsToLevelUp[playerLevel - 1] : '-')
                    + ' needed';
            $('<div></div>')
                .addClass("starTracker")
                .html(starsEarnedHtml + '<br/>' + starsToNextLevelHtml)
                .appendTo('#gameScreen')
        },
        //Remove all contents of the main game window
        clearScreen: function(){
            $("#gameScreen").html("");
        },
        //Creates the GUI of the menu
        drawMap : function(){
            //Creates the main map div
            $("<div/>",{
                "class": "mainMap"
            }).appendTo("#gameScreen");
            //Creates loadout button
            $("<div>LOADOUT</div>")
                .addClass("loadoutButton")
                .on("click",function(){
                    Loadout.drawLoadoutScreen();
                })
                .appendTo("#gameScreen");

            //Draw the timer
            $('<div id="timer">' + InteractionManager.getTime() + '</div>').addClass("inMap").appendTo('#gameScreen');

            //Creates the three areas
            for(var i=0;i < Game.areas.length;i++){
                var tempArea = document.createElement("div");
                if(Game.areas[i].active){
                    tempArea.className="colored area"+i;
                }
                else{
                    tempArea.className="greyscale area"+i;
                }
                document.getElementById("gameScreen").appendChild(tempArea);
                if(Game.areas[i].active){
                    Game.drawMissions(i);
                }
            }
        },
        //Creates an error message with given content
        errorMessage: function(content){
            $("<div>"+content+"</div>")
                .addClass("errorMessage")
                .appendTo("#gameScreen")
                .fadeOut(2000,"linear",function(){
                    $(this).remove();
                })
        }
    });
});