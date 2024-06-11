window.addEventListener("load", onLoad);

const canvasVerticalPassTimeMs = 5000;
const crossLineY = 350;
const accuracyDeltaMs = 100;

var canvas;
var context;

var x = 50;
var y = 0;
var noteVelocity = 0;
var songStartTime = 0;
var currentSongTimeMs = 0;

var note;

function onLoad() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    loadGame();

    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("click", onPlayClick);

    noteVelocity = canvas.height / canvasVerticalPassTimeMs;
}

function loadGame() {
    note = new Note(2000);
}

function onKeyDown(event) {
    if (event.defaultPrevented) {
        // Do nothing if event already handled
        return; 
    }

    const consumed = event.code === "KeyJ";

    if (consumed) {
        const curSongTime = Date.now() - songStartTime;
        note.checkHit(curSongTime, accuracyDeltaMs);
    }

    // Consume the event so it doesn't get handled twice
    if (consumed) {
        event.preventDefault();
    }
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
    const noteStartingPosition = crossLineY - noteVelocity * note.time;

    currentSongTimeMs = Date.now() - songStartTime;
    y = noteVelocity * currentSongTimeMs + noteStartingPosition;
}

function draw() {
    clearCanvas();

    const noteColor = note.isPressed ? "green" : "red";
    drawRectangle(x, y, 40, 50, noteColor);
    drawText(currentSongTimeMs);
    drawLine(0, crossLineY, 1000, crossLineY, "white");

    const windowStartLineY = crossLineY - accuracyDeltaMs * noteVelocity;
    const windowEndLineY = crossLineY + accuracyDeltaMs * noteVelocity;
    drawLine(0, windowStartLineY , 1000, windowStartLineY, "grey");
    drawLine(0, windowEndLineY, 1000, windowEndLineY, "grey");
}

function drawRectangle(x, y, h, w, color) {
    context.beginPath();
    context.rect(x, y, h, w);
    context.fillStyle = color;
    context.closePath();
    context.fill();
}

function drawLine(x1, y1, x2, y2, color) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();
}

function drawText(text) {
    context.font = "20px serif";
    context.fillText(text, 10, 20);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
