window.addEventListener("load", onLoad);

const canvasVerticalPassTimeMs = 2000;

var canvas;
var context;

var x = 50;
var y = 0;
var noteVelocity = 0;
var songStartTime = 0;

function onLoad() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.addEventListener("click", onPlayClick);

    noteVelocity = canvas.height / canvasVerticalPassTimeMs;
}

function onPlayClick() {
    songStartTime = Date.now();

    intervalId = setInterval(gameLoop, 15);
}

function gameLoop() {
    updateState();
    draw();
}

function updateState() {
    currentSongTimeMs = Date.now() - songStartTime;
    y = noteVelocity * currentSongTimeMs;
}

function draw() {
    clearCanvas();
    drawRectangle(x, y, 40, 50);
}

function drawRectangle(x, y, h, w) {
    context.beginPath();
    context.rect(x, y, h, w);
    context.fillStyle = "green";
    context.closePath();
    context.fill();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}