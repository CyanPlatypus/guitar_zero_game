window.addEventListener("load", onLoad);

var canvas;
var context;

function onLoad() {

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    canvas.addEventListener("click", onPlayClick);
}

function onPlayClick() {
    intervalId = setInterval(gameLoop, 15);
}

function gameLoop() {
    updateState();
    draw();
}

function updateState() {

}

function draw() {
    clearCanvas();
    drawRectangle(10, 10, 40, 50);
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