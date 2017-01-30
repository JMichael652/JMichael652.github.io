"use strict";

// Constants
var SIDE_SPACER = 100;
var TOWER_BASE_W = 300;
var TOWER_BASE_H = 12;
var TOWER_SPACER = 50;
var TOP_SPACER = 75;
var TOWER_POLE_W = 18;
var TOWER_POLE_H = 613;
var BOTTOM_SPACER = 0;
var RAISE_HEIGHT = 40;
var RAISE_RATE = 20;
var SHIFT_RATE = 20;
var FALL_RATE = 20;

// Globals
var ctx;
var towerData;
var ringData;
var towersPath;
var time;
var moveInterval;
var change;
var raised;
var shifted;
var dropped;
var brickPattern;
var ringPatterns;

function init() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'black';

        // Prepare Textures
        var brickImg;
        var ringImgs = new Array(4);
        ringPatterns = new Array(4);

        brickImg = new Image();
        brickImg.src = "images/towerBrick.png";
        brickImg.onload = function () {
            brickPattern = ctx.createPattern(brickImg, 'repeat');
            ringImgs[0] = new Image();
            ringImgs[0].src = "images/ringStyle1.png";
            ringImgs[0].onload = function () {
                ringPatterns[0] = ctx.createPattern(ringImgs[0], 'repeat');
                ringImgs[1] = new Image();
                ringImgs[1].src = "images/ringStyle2.png";
                ringImgs[1].onload = function () {
                    ringPatterns[1] = ctx.createPattern(ringImgs[1], 'repeat');
                    ringImgs[2] = new Image();
                    ringImgs[2].src = "images/ringStyle3.png";
                    ringImgs[2].onload = function () {
                        ringPatterns[2] = ctx.createPattern(ringImgs[2], 'repeat');
                        ringImgs[3] = new Image();
                        ringImgs[3].src = "images/ringStyle4.png";
                        ringImgs[3].onload = function () {
                            ringPatterns[3] = ctx.createPattern(ringImgs[3], 'repeat');

                            // Draw Towers
                            initTowerData();
                            initTowers();
                            ctx.fillStyle = brickPattern;
                            ctx.fill(towersPath);

                            // Draw Rings
                            initRingData();
                            moveInterval = setInterval(move, 1000);
                            drawRings(ctx);

                            // Prepare animations
                            change = new Array(3);
                            change[0] = -1;
                            raised = false;
                            shifted = false;
                            dropped = false;
                        };
                    };
                };
            };
        };
    } else {
        alert("This browser does not support HTML5 Canvas.");
    }
}

function initTowerData() {
    towerData = new Array(3);

    var tower1 = new Object();
    tower1.x = SIDE_SPACER+TOWER_BASE_W/2;
    tower1.ringCount = 0;
    towerData[0] = tower1;

    var tower2 = new Object();
    tower2.x = SIDE_SPACER+TOWER_BASE_W+TOWER_SPACER+TOWER_BASE_W/2;
    tower2.ringCount = 0;
    towerData[1] = tower2;

    var tower3 = new Object();
    tower3.x = SIDE_SPACER+TOWER_BASE_W*2+TOWER_SPACER*2+TOWER_BASE_W/2;
    tower3.ringCount = 0;
    towerData[2] = tower3;
}

function initRingData() {
    ringData = new Array(64);

    time = secondsElapsed();

    var minWidth = 100;
    var maxWidth = 250;
    var step = (maxWidth-minWidth)/63;

    for (var i = 63; i >= 0; i--) {
        ringData[i] = new Object();
        ringData[i].width = minWidth + step*i;
        ringData[i].height = TOWER_POLE_H/64;
        ringData[i].pole = ringLocation(i, time);
        towerData[ringData[i].pole].ringCount++;
        ringData[i].x = towerData[ringData[i].pole].x-ringData[i].width/2;
        ringData[i].y = getRingY(ringData[i].pole);
    }
}

function initTowers() {
    // Initialize tower paths
    towersPath = new Path2D();

    // Tower 1
    towersPath.rect(SIDE_SPACER, TOP_SPACER+TOWER_POLE_H,
        TOWER_BASE_W, TOWER_BASE_H);
    towersPath.rect(SIDE_SPACER+TOWER_BASE_W/2-TOWER_POLE_W/2, TOP_SPACER,
        TOWER_POLE_W, TOWER_POLE_H);

    // Tower 2
    towersPath.rect(SIDE_SPACER+TOWER_BASE_W+TOWER_SPACER, TOP_SPACER+TOWER_POLE_H,
        TOWER_BASE_W, TOWER_BASE_H);
    towersPath.rect(SIDE_SPACER+TOWER_BASE_W+TOWER_SPACER+TOWER_BASE_W/2-TOWER_POLE_W/2, TOP_SPACER,
        TOWER_POLE_W, TOWER_POLE_H);

    // Tower 3
    towersPath.rect(SIDE_SPACER+TOWER_BASE_W*2+TOWER_SPACER*2, TOP_SPACER+TOWER_POLE_H,
        TOWER_BASE_W, TOWER_BASE_H);
    towersPath.rect(SIDE_SPACER+TOWER_BASE_W*2+TOWER_SPACER*2+TOWER_BASE_W/2-TOWER_POLE_W/2, TOP_SPACER,
        TOWER_POLE_W, TOWER_POLE_H);
}

function getRingY(tower) {
    return TOP_SPACER+TOWER_POLE_H-(towerData[tower].ringCount)*ringData[63].height;
}

function drawRings(ctx) {
    for (var i = 0; i < ringData.length; i++) {
        ctx.fillStyle = ringPatterns[i%ringPatterns.length];
        ctx.fillRect(ringData[i].x, ringData[i].y, ringData[i].width, ringData[i].height);
    }
}

function secondsElapsed() {
    var secsBefore1970 = 6311520000000;  // Since man walked the earth 200,000 years ago
    var secsSince1970 = Math.floor((new Date()).getTime()/1000);
    console.log(secsBefore1970 + secsSince1970);
    return secsBefore1970 + secsSince1970;
}

function ringLocation(ring, time) {
    if (ring == 0) {
        return Math.floor((time+1)/2) % 3;
    } else if (ring % 2 == 0) {
        return (Math.floor((time-Math.pow(2,ring)) / Math.pow(2,ring+1)) + 1) % 3;
    } else {
        var out = (Math.floor((time-Math.pow(2,ring)) / Math.pow(2,ring+1)) + 1) % 3;
        if (out == 1) {
            return 2;
        } else if (out == 2) {
            return 1;
        } else {
            return 0;
        }
    }
}

function move() {
    if (change[0] != -1) {
        console.log("skip");
        ringData[change[0]].x = towerData[change[2]].x-ringData[change[0]].width/2;
        towerData[change[2]].ringCount++;
        ringData[change[0]].y = getRingY(change[2]);
        raised = false;
        shifted = false;
        dropped = false;
        change[0] = -1;
    }
    change = findChange(time, secondsElapsed());
    console.log(change.join());
    towerData[change[1]].ringCount--;
    window.requestAnimationFrame(relocate);
}

function findChange(oldTime, newTime) {
    var newPole;
    var out;
    for (var i = 0; i < ringData.length; i++) {
        newPole = ringLocation(i, newTime);
        if (ringData[i].pole != newPole) {
            console.log("Ring " + (i+1) + " moved from " + (ringData[i].pole+1) + " to " + (newPole+1));
            out = [i, ringData[i].pole, newPole];
            ringData[i].pole = newPole;
            return out;
        }
    }
}

function relocate(timestamp) {

    if (!raised) {
        ringData[change[0]].y -= RAISE_RATE;
        if (ringData[change[0]].y <= RAISE_HEIGHT) {
            ringData[change[0]].y = RAISE_HEIGHT;
            raised = true;
        }
        draw();
        window.requestAnimationFrame(relocate);
    } else if (!shifted) {
        if (change[1] < change[2]) {
            ringData[change[0]].x += SHIFT_RATE;
            if (ringData[change[0]].x >= towerData[change[2]].x-ringData[change[0]].width/2) {
                ringData[change[0]].x = towerData[change[2]].x-ringData[change[0]].width/2;
                shifted = true;
            }
        } else {
            ringData[change[0]].x -= SHIFT_RATE;
            if (ringData[change[0]].x <= towerData[change[2]].x-ringData[change[0]].width/2) {
                ringData[change[0]].x = towerData[change[2]].x-ringData[change[0]].width/2;
                shifted = true;
            }
        }
        draw();
        window.requestAnimationFrame(relocate);
    } else if (!dropped) {
        ringData[change[0]].y += FALL_RATE;
        if (ringData[change[0]].y >= getRingY(change[2])-ringData[change[0]].height) {
            ringData[change[0]].y = getRingY(change[2])-ringData[change[0]].height;
            dropped = true;
        }
        draw();
        window.requestAnimationFrame(relocate);
    } else {
        towerData[change[2]].ringCount++;
        raised = false;
        shifted = false;
        dropped = false;
        change[0] = -1;
    }
}

function draw() {
    ctx.clearRect(0, 0, 1200, 700);
    ctx.fillStyle = brickPattern;
    ctx.fill(towersPath);
    drawRings(ctx);
}