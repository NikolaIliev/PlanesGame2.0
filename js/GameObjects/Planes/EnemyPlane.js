﻿EnemyPlane = Plane.extend({
    init: function (left, bottom, maxHealth, damage, movementSpeed) {
        this._super(maxHealth, damage);
        this.movementSpeed = movementSpeed;
        this.updateCoords(left, bottom);
        this.move();
        this.bulletType = "enemy";
        this.div.className = "enemyPlane";
        this.hpBar = document.createElement('div');
        this.hpBar.className = "hpBarEnemy";
        this.lastDirectionChangeTimestamp = -1;
        $(this.hpBar).appendTo(this.div);
    },
    movingRight: null,
    movingUp: null,
    hpBar: null,
    updateCoords: function (left, bottom) {
        this._super(left, bottom);
    },

    lastDirectionChangeTimestamp: null,

    changeDirection: function () {
        //Generates a random number [0,3] and changes direction accordingly
        switch (parseInt(Math.random() * 2)) {
            case 0:
                this.movingRight = !this.movingRight;
                break;
            case 1:
                this.movingUp = !this.movingUp;
                break;
            default:
                throw new Error("Error with generating a random number [0,1] @ EnemyFighter::changeDirection()");
        }

    },

    moveAtDirection: function () {
        //fighters can only move diagonally
        if (this.movingRight && this.leftCoord < (960 - 95)) {
            this.leftCoord += this.movementSpeed;
        } else if (!this.movingRight && this.leftCoord > 3) {
            this.leftCoord -= this.movementSpeed;
        }

        if (this.movingUp && this.bottomCoord < (700 - 70)) {
            this.bottomCoord += this.movementSpeed;
        } else if (!this.movingUp && this.bottomCoord > (350)) {
            this.bottomCoord -= this.movementSpeed;
        }
    },

    updateHpBar: function () {
        this.hpBar.style.width = parseInt(this.currentHealth / this.maxHealth * 100) + '%';
    },

    die: function () {
        var self = this;
        this.div.style['-webkit-animation'] = 'enemyDeathAnimation 1.5s';
        window.setTimeout(function () {
            $(self.div).remove();
        }, 1500);
    }
});