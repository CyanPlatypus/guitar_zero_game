window.addEventListener("load", onLoad);

const canvasVerticalPassTimeMs = 2000;

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
    note = new Note(1000);
}


function onKeyDown(event) {
    if (event.defaultPrevented) {
        // Do nothing if event already handled
        return; 
    }

    const consumed = event.code === "KeyJ";

    if (consumed) {
        note.checkHit(Date.now());
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
    currentSongTimeMs = Date.now() - songStartTime;
    y = noteVelocity * currentSongTimeMs;
}

function draw() {
    clearCanvas();
    const noteColor = note.isPressed ? "green" : "red";
    drawRectangle(x, y, 40, 50, noteColor);
    drawText(currentSongTimeMs);
}

function drawRectangle(x, y, h, w, color) {
    context.beginPath();
    context.rect(x, y, h, w);
    context.fillStyle = color;
    context.closePath();
    context.fill();
}

function drawText(text) {
    context.font = "20px serif";
    context.fillText(text, 10, 20);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
