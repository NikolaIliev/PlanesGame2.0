'use strict'
var ctx;
var Game = {
    allSkills : ["spreadshot","homingshot","penetratingshot","sentry","stoptime","deathray", "blackhole", "stealth", "radioactive", "healingshot", 'guidedrocket', 'shield', 'absorbbullets'],
    unlockedSkills: [],
    highScoreArr: [],
	//Initialization
    init: function () {
        InteractionManager.startTimer();
        Game.addSkill();
		this.clearScreen();
		AreaManager.areas[0].active = true;
		MissionManager.generateMissions();
		AreaManager.drawMap();
		Visual.drawGameObjects();
		if (!this.allUnlocked) {
		    Visual.updateStarsTracker();
		}
	},

	//Remove all contents of the main game window
	clearScreen : function(){
	    $("#gameScreen").html("");
	},

	//Creates an error message with given content
	errorMessage : function(content){
		$("<div>"+content+"</div>")
		.addClass("errorMessage")
		.appendTo("#gameScreen")
		.fadeOut(2000,"linear",function(){
		$(this).remove();
	})
	},

	//Skills
	addSkill : function(){
		var index = Math.floor(Math.random() * (this.allSkills.length));
		if(this.allSkills[index]==undefined){
			return;
		}
		this.unlockedSkills.push(this.allSkills.splice(index,1)[0]);
		return this.unlockedSkills[this.unlockedSkills.length-1];
	},

	unlockEverything: function () {
	    var i;
	    for (i = 0; i < 13; i++) {
	        Game.addSkill();
	    }
	    AreaManager.areas[1].active = true;
	    AreaManager.areas[2].active = true;
	    AreaManager.areas[3].active = true;
	    this.allUnlocked = true;
	},

    allUnlocked: false
	
}

var imgPaths = ['images/planes/player.png', 'images/planes/fighter.png', 'images/planes/kamikaze.png', 'images/planes/supplier.png', 'images/planes/stormer.png', 'images/planes/boss.png', 'images/planes/playerAbsorbingBullets.png', 'images/planes/sentry.png', 'images/planes/stormCloudFrames.png', 'images/planes/fighter_spreadshot.png', 'images/backgrounds/desert.jpg', 'images/backgrounds/ocean.jpg', 'images/backgrounds/river.jpg', 'images/backgrounds/snow.jpg',
    'images/map/AreaOneColored.png', 'images/map/AreaOneGreyscale.png', 'images/map/AreaTwoColored.png', 'images/map/AreaTwoGreyscale.png', 'images/map/AreaThreeColored.png', 'images/map/AreaThreeGreyscale.png', 'images/map/endScreen.png', 'images/map/IntroScreen.png', 'images/map/MissionMarkerBoss.png', 'images/map/MissionMarkerEmpty.png', 'images/map/MissionMarkerOne.png', 'images/map/MissionMarkerTwo.png', 'images/map/MissionMarkerThree.png',
    'images/map/MissionMarkerUnplayed.png', 'images/map/promptStar.png', 'images/map/star.png', 'images/map/starMini.png', 'images/map/WorldMapMinified.png', 'images/skills/guidedRocket.png', 'images/skills/HealthOrbFrames.png', 'images/UI/UI.png', 'images/UI/pointerCursor.png', 'images/UI/hoverCursor.png'];

window.addEventListener("load", function () {
    var i;
    $('<div id="loadingBarOutline"> </div>')
        .css({
            'text-align': 'center',
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
            'height': '100%',
            'width': '0%',
            'background-color': 'white'
        })
        .appendTo('#loadingBarOutline');
    $('<span id="loadingPercentage"> </span>')
        .css('position', 'absolute')
        .appendTo('#loadingBarOutline');
    for (i = 0; i < imgPaths.length; i++) {
        PreloadManager.addToQueue(imgPaths[i]);
    }
    PreloadManager.preloadAll(Visual.drawIntroScreen);
    
    if (!requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    }
});

