define([
    "Engine/InteractionManager",
    "Engine/Visual",
    "UserInterface/loadout",
    "exports"
], function (InteractionManager, Visual, Loadout, exports) {
    function MissionInfo(primary, secondary) {
        this.primary = primary;
        this.secondary = secondary;
        this.complete = false;
        this.rank = -1;
    }

    function AreaInfo(missions){
        //Array of all missions in the area
        this.missions = missions;
        //Determines if this area is unlocked
        this.active = false;
        //Ammount of points won from missions
        this.pointsInArea = 0;
    }



    _.extend(exports, {
        //Contains primary and secondary mission types
        //
        //primaryMissionTypes: ['survival', 'domination', 'gauntlet'],
        primaryMissionTypes: ['domination'],
        //primary: ["survival"],
        secondaryMissionTypes: ['remainingHealth', 'accuracy', 'usedSkills'],
        unlockableSkills : ["spreadshot","homingshot","penetratingshot","sentry","stoptime","deathray", "blackhole", "stealth", "radioactive", "healingshot", 'guidedrocket', 'shield', 'absorbbullets'],
        unlockedSkills: [],
        highScoreArr: [],
        currentAreaIndex: -1,
        currentMissionIndex: -1,
        areas: [],
        allUnlocked: false,
        //Initialization
        init: function () {
            InteractionManager.startTimer();
            this.addSkill();
            this.generateAreas();
        },

        //Skills
        addSkill: function(){
            var index = Math.floor(Math.random() * (this.unlockableSkills.length));
            if(this.unlockableSkills[index]==undefined){
                return;
            }
            this.unlockedSkills.push(this.unlockableSkills.splice(index,1)[0]);
            return this.unlockedSkills[this.unlockedSkills.length-1];
        },

        unlockEverything: function () {
            var i;
            for (i = 0; i < 13; i++) {
                this.addSkill();
            }
            this.areas[1].active = true;
            this.areas[2].active = true;
            this.areas[3].active = true;
            this.allUnlocked = true;
        },

        //Makes corrections to the activity of areas, and activates boss challenge, if neccesary
        updateAreaStatus : function(stars){
            var curMis = this.currentMissionIndex;
            var curArea = this.currentAreaIndex;
            this.areas[curArea].missions[curMis].complete = true;
            if(stars===undefined){
                stars=0;
            }
            this.areas[curArea].missions[curMis].rank = stars;
            this.areas[curArea].pointsInArea += stars;
            for(var i=0;i<this.areas.length-1;i++){
                if(this.areas[i+1].active == false){
                    if(this.areas[i].pointsInArea >= 5){
                        this.areas[i+1].active = true;
                    }
                    else if (this.areas[i + 1] != undefined &&
                        this.areas[i].missions[0].complete && this.areas[i].missions[1].complete && this.areas[i].missions[2].complete) {
                        this.areas[i + 1].active = true
                    }
                }
            }
        },
        generateAreas: function () {
            this.areas = [
                new AreaInfo(this.generateMissions()),new AreaInfo(this.generateMissions()),
                new AreaInfo(this.generateMissions()),
                new AreaInfo([new MissionInfo("boss","boss")])
            ];

            this.areas[0].active = true;
        },
        //Generates an array of mission and returns it
        generateMissions: function () {
            var tempArray = [];
            for (var i = 0; i < 3; i++) {
                var primIndex = Math.floor(Math.random() * (this.primaryMissionTypes.length));
                var secIndex = Math.floor(Math.random() * (this.secondaryMissionTypes.length));
                tempArray.push(new MissionInfo(this.primaryMissionTypes[primIndex], this.secondaryMissionTypes[secIndex]));
            }
            return tempArray;
        },
        drawMissions: function (area) {
            var self = this;

            for (var i = 0; i < this.areas[area].missions.length; i++) {
                var stars = this.areas[area].missions[i].rank;
                var className = "missionMarker " + ((area == 3) ? "boss" : "Star" + stars + " a" + area + "m" + i);
                //Creates mission icons
                $("<div/>")
                    .addClass(className)
                    .attr('mission', i)
                    .on('click', function () {
                        //Calls the missionPrompt function, with the clicked area and mission
                        var thisMission = this.getAttribute("mission");
                        if (self.areas[area].missions[thisMission].complete) {
                            Visual.errorMessage("Cannot replay mission!");
                        } else {
                            self.missionPrompt(area, thisMission);
                        }
                    }).appendTo("#gameScreen");
            }
        },

        //Creates a prompt containing information about
        missionPrompt: function (areaIndex, missionIndex) {
            var primary = this.areas[areaIndex].missions[missionIndex].primary;
            var secondary = this.areas[areaIndex].missions[missionIndex].secondary;
            var title, primaryDescription, secondaryDescription;

            switch (primary) {
                case "survival":
                    title = "Survival";
                    primaryDescription = "<p>Survive in the battlefield for 45 seconds</p>";
                    break;
                case "domination":
                    title = "Domination";
                    primaryDescription = "<p>Do not allow more than 7 enemies to appear simultaneously for 30 seconds</p>";
                    break;
                case "gauntlet":
                    title = "Gauntlet";
                    primaryDescription = "<p>Kill 70 enemies. Pressing E will spawn 3 enemy static</p>";
                    break;
                case "boss":
                    title = 'Boss Fight';
                    primaryDescription = '<p>Defeat the boss.</p>';
                    break;
                default:
                    throw new Error('Uncrecognized primary mission type');
            }

            switch (secondary) {
                case "remainingHealth":
                    secondaryDescription = "<ul class='secDesc'><li>Remain above 25% health.</li><li>Remain above 50% health.</li><li>Remain above 75% health.</li></ul>";
                    break;
                case "usedSkills":
                    secondaryDescription = "<ul class='secDesc'><li>Use your skills less than 9 times.</li><li>Use your skills less than 7 times.</li><li>Use your skills less than 5 times.</li></ul>";
                    break;
                case "accuracy":
                    secondaryDescription = "<ul class='secDesc'><li>Keep your accuracy above 25%</li><li>Keep your accuracy above 35%</li><li>Keep your accuracy above 50%</li></ul>";
                    break;

                case "boss":
                    secondaryDescription = "We've managed to intercept the aircraft initiating all these attacks. Take it down, and bring an end to this war.";
                    break;
                default:
                    break;
            }
            //Creates:
            //Black tint
            $("<div/>", {
                id: "GamePromptScreen"
            })
                .appendTo("#gameScreen");
            //Prompt box
            $("<div/>", {
                id: "GamePrompt"
            })
                .addClass("gameWindow")
                .appendTo("#GamePromptScreen");
            //Close button
            $("<div id='closePrompt'>X<div/>")
                .on("click", function () {
                    document.getElementById("gameScreen").removeChild(document.getElementById("GamePromptScreen"));
                })
                .appendTo("#GamePrompt");
            //Title
            $("<div>" + title + "<div/>", {
            })
                .addClass("promptText promptTitle")
                .appendTo("#GamePrompt");
            //Main objective
            $("<div>" + primaryDescription + "<div/>")
                .addClass("promptText")
                .appendTo("#GamePrompt");
            //Secondary objective
            $("<div>" + secondaryDescription + "<div/>")
                .addClass("promptText")
                .appendTo("#GamePrompt");
            //Start button
            $("<div>Deploy<div/>")
                .addClass("deployButton")
                .on("click", function () {
                    InteractionManager.startNewMission(missionIndex, areaIndex);
                })
                .appendTo("#GamePrompt");

        },
        //Creates a window displaying results of victory
        winScreen: function (stars) {
            var skillClass, skillDescription,
                starsToLevelUp = InteractionManager.getStarsToLevelUp(),
                currentPlayerLevel = InteractionManager.getPlayerLevel(),
                currentPlayerStars = InteractionManager.getPlayerStars();
            //Creates:
            //Black tint
            $("<div/>", {
                id: "GamePromptScreen"
            })
                .appendTo("#gameScreen");
            //Prompt box
            $("<div/>", {
                id: "GamePrompt"
            })
                .addClass("gameWindow")
                .appendTo("#GamePromptScreen");
            //Close prompt
            $("<div id='closePrompt'>X<div/>")
                .on("click", function () {
                    document.getElementById("gameScreen").removeChild(document.getElementById("GamePromptScreen"));
                })
                .appendTo("#GamePrompt");
            //Victory
            $("<div>Victory<div/>", {
            })
                .addClass("promptText promptTitle")
                .appendTo("#GamePrompt");
            //Stars
            for (var i = 0; i < stars; i++) {
                $("<span/>")
                    .addClass("promptStar")
                    .appendTo(".prompt title");
            }
            //Content box
            $("<div/>", {
                id: "ContentBox"
            })
                .appendTo("#GamePrompt");
            //Handles levelling up
            if (!this.allUnlocked && starsToLevelUp[currentPlayerLevel - 1] && currentPlayerStars >= starsToLevelUp[currentPlayerLevel - 1]) {
                $("#ContentBox").text("You earned enough stars to level up! Your plane has been upgraded and you unlocked the following skills:");

                $("<div/>")
                    .addClass("promptText")
                    .appendTo("#GamePrompt");

                while (starsToLevelUp[currentPlayerLevel - 1] && currentPlayerStars >= starsToLevelUp[currentPlayerLevel - 1]) {
                    InteractionManager.increasePlayerLevel();
                    currentPlayerLevel++;
                    switch (this.addSkill()) {

                        case "spreadshot":
                            skillClass = "spreadShotIcon";
                            skillDescription = "Temporarily gain a three shot attack";
                            break;

                        case "penetratingshot":
                            skillClass = "penetratingShotIcon";
                            skillDescription = "Your bullets temporarily pierce targets";
                            break;

                        case "homingshot":
                            skillClass = "homingShotIcon";
                            skillDescription = "Your projectiles seek out enemies";
                            break;

                        case "sentry":
                            skillClass = "sentryIcon";
                            skillDescription = "Place a sentry which attacks enemies. Rotate it with A and D";
                            break;

                        case 'stoptime':
                            skillClass = 'stopTimeIcon';
                            skillDescription = "Freeze enemies in place, while retaining your ability to move";
                            break;

                        case 'deathray':
                            skillClass = 'deathRayIcon';
                            skillDescription = 'Annihilate all enemies in a line in front of you';
                            break;

                        case 'guidedrocket':
                            skillClass = 'guidedRocketIcon';
                            skillDescription = 'Draw a path and the rocket will follow it, destroying all enemies';
                            break;

                        case 'stealth':
                            skillClass = 'stealthIcon';
                            skillDescription = "Vanish, causing all bullets to miss you for 2 seconds";
                            break;

                        case 'healingshot':
                            skillClass = 'healingShotIcon';
                            skillDescription = 'Your bullets will heal you a small amount for each enemy you hit';
                            break;

                        case 'absorbbullets':
                            skillClass = 'absorbBulletsIcon';
                            skillDescription = 'Enemy bullets will temporarily heal (instead of harm) you';
                            break;

                        case 'radioactive':
                            skillClass = 'radioactiveIcon';
                            skillDescription = 'Release a decimating radioactive wave to your enemies';
                            break;

                        case 'shield':
                            skillClass = 'shieldIcon';
                            skillDescription = 'Shields you from harm, preventing all damage from the next 5 bullets';
                            break;

                        case 'blackhole':
                            skillClass = 'blackHoleIcon';
                            skillDescription = 'After use, click somewhere on the battlefield to suck all enemies there';
                            break;

                        default:
                            throw new Error('Unrecognized skill unlock');
                    }
                    $("<div/>")
                        .addClass("skillIcon " + skillClass)
                        .appendTo(".promptText:odd")
                        .on("mouseenter",function(){
                            $("<div/>").addClass("descriptionBox gameWindow").html(Loadout.generateDescription($(this))).appendTo("#gameScreen")
                        }).on("mouseleave",function(){
                            $(".descriptionBox").remove();
                        });
                }
            }
            else {
                $("#ContentBox").text("You finished the mission and earned " + stars + " stars.");
            }
        }
    });
});
//var imgPaths = ['images/static/player.png', 'images/static/fighter.png', 'images/static/kamikaze.png', 'images/static/supplier.png', 'images/static/stormer.png', 'images/static/boss.png', 'images/static/playerAbsorbingBullets.png', 'images/static/sentry.png', 'images/sprites/stormCloudFrames.png', 'images/static/fighter_spreadshot.png', 'images/backgrounds/desert.jpg', 'images/backgrounds/ocean.jpg', 'images/backgrounds/river.jpg', 'images/backgrounds/snow.jpg',
//    'images/map/AreaOneColored.png', 'images/map/AreaOneGreyscale.png', 'images/map/AreaTwoColored.png', 'images/map/AreaTwoGreyscale.png', 'images/map/AreaThreeColored.png', 'images/map/AreaThreeGreyscale.png', 'images/map/endScreen.png', 'images/map/IntroScreen.png', 'images/map/MissionMarkerBoss.png', 'images/map/MissionMarkerEmpty.png', 'images/map/MissionMarkerOne.png', 'images/map/MissionMarkerTwo.png', 'images/map/MissionMarkerThree.png',
//    'images/map/MissionMarkerUnplayed.png', 'images/map/promptStar.png', 'images/map/star.png', 'images/map/starMini.png', 'images/map/WorldMapMinified.png', 'images/skills/guidedRocket.png', 'images/sprites/HealthOrbFrames.png', 'images/UI/UI.png', 'images/UI/pointerCursor.png', 'images/UI/hoverCursor.png', 'images/UI/absorbBulletsIcon.png', 'images/UI/absorbBulletsIconCD.png', 'images/UI/blackHoleIcon.png', 'images/UI/blackHoleIconCD.png', 'images/UI/deathRayIcon.png',
//    'images/UI/deathRayIconCD.png', 'images/UI/guidedRocketIcon.png', 'images/UI/guidedRocketIconCD.png', 'images/UI/healingShotIcon.png', 'images/UI/healingShotIconCD.png', 'images/UI/homingShotIcon.png', 'images/UI/homingShotIconCD.png', 'images/UI/penetratingShotIcon.png', 'images/UI/penetratingShotIconCD.png', 'images/UI/radioactiveIcon.png', 'images/UI/radioactiveIconCD.png', 'images/UI/sentryIcon.png', 'images/UI/sentryIconCD.png', 'images/UI/shieldIcon.png',
//    'images/UI/shieldIconCD.png', 'images/UI/spreadShotIcon.png', 'images/UI/spreadShotIconCD.png', 'images/UI/stealthIcon.png', 'images/UI/stealthIconCD.png', 'images/UI/stopTimeIcon.png', 'images/UI/stopTimeIconCD.png'
//];

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