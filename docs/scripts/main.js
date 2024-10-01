window.addEventListener("load", onLoad);

const canvasVerticalPassTimeMs = 5000;
const crossLineY = 350;
const lineWidth = 80;
const separatorWidth = 1;
const accuracyDeltaMs = 100;

var canvas;
var context;

var song;

function onLoad() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    loadGame();

    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("click", onPlayClick);

    
}

function loadGame() {
    const songVelocity = canvas.height / canvasVerticalPassTimeMs;
    
    const centerX = canvas.width / 2;
    const line1x = centerX - (lineWidth * 2 + separatorWidth * 1.5) + (lineWidth / 2);
    const line2x = centerX - (lineWidth + separatorWidth * 0.5) + (lineWidth / 2);
    const line3x = centerX + separatorWidth * 0.5 + (lineWidth / 2);
    const line4x = centerX + lineWidth + separatorWidth * 1.5 + (lineWidth / 2);

    song = new Song(
        songVelocity,
        [
            new Note(2000, new NoteView(line1x, 0, lineWidth), crossLineY, songVelocity),
            new Note(3000, new NoteView(line1x, 0, lineWidth), crossLineY, songVelocity),
            new Note(5000, new NoteView(line1x, 0, lineWidth), crossLineY, songVelocity)
        ],
        [
            new Note(1000, new NoteView(line2x, 0, lineWidth), crossLineY, songVelocity),
            new Note(2000, new NoteView(line2x, 0, lineWidth), crossLineY, songVelocity),
            new Note(6000, new NoteView(line2x, 0, lineWidth), crossLineY, songVelocity)
        ],
        [
            new Note(3000, new NoteView(line3x, 0, lineWidth), crossLineY, songVelocity),
            new Note(4000, new NoteView(line3x, 0, lineWidth), crossLineY, songVelocity),
            new Note(5000, new NoteView(line3x, 0, lineWidth), crossLineY, songVelocity)
        ],
        [
            new Note(4000, new NoteView(line4x, 0, lineWidth), crossLineY, songVelocity),
            new Note(6000, new NoteView(line4x, 0, lineWidth), crossLineY, songVelocity)
        ]
    );
}

function onKeyDown(event) {
    if (event.defaultPrevented) {
        // Do nothing if event already handled
        return; 
    }
    if (event.repeat) {
        // Given key is being held down such that it is automatically repeating
        return;
    }

    console.log('hi');
    const consumed = ["KeyD","KeyF", "KeyJ","KeyK"].includes(event.code);

    if (event.code === "KeyD") {
        song.checkHit(accuracyDeltaMs, "Lane1");
    } else if (event.code === "KeyF") {
        song.checkHit(accuracyDeltaMs, "Lane2");
    } else if (event.code === "KeyJ") {
        song.checkHit(accuracyDeltaMs, "Lane3");
    } else if (event.code === "KeyK") {
        song.checkHit(accuracyDeltaMs, "Lane4");
    }

    // Consume the event so it doesn't get handled twice
    if (consumed) {
        event.preventDefault();
    }
}

function onPlayClick() {
    song.songStartTime = Date.now();

    intervalId = setInterval(gameLoop, 15);
}

function gameLoop() {
    updateState();
    draw();
}

function updateState() {
    song.update(crossLineY);
}

function draw() {
    clearCanvas();

    drawText(song.currentSongTimeMs);

    drawLaneBase();

    drawSong(song);

    // drawDebug()
}

function drawLaneBase() {
    const centerX = canvas.width / 2;
    const laneBaseWidth = lineWidth * 4 + separatorWidth * 3;
    const laneBaseX = centerX - laneBaseWidth / 2;
    const separator1x = centerX - separatorWidth * 1.5 - lineWidth;
    const separator2x = centerX - separatorWidth * 0.5;
    const separator3x = centerX + separatorWidth * 0.5 + lineWidth;

    // base
    drawRectangle(laneBaseX, 0, laneBaseWidth, canvas.height, "white");

    // separators
    drawLine(separator1x, 0, separator1x, canvas.height, "grey", separatorWidth);
    drawLine(separator2x, 0, separator2x, canvas.height, "grey", separatorWidth);
    drawLine(separator3x, 0, separator3x, canvas.height, "grey", separatorWidth);

    // cross line
    drawLine(laneBaseX, crossLineY, laneBaseX + laneBaseWidth, crossLineY, "grey", 3);
}

function drawSong(song) {
    for ([laneName, laneNotes] of Object.entries(song.lanes)) {
        for (const note of laneNotes){
            drawNote(note);
        }
    }
}

function drawNote(note) {
    drawX = note.view.x - note.view.radius / 2;
    drawY = note.view.y - note.view.radius / 2;

    const noteColor = note.isPressed ? "green" : "red";
    drawRectangle(drawX, drawY, note.view.radius, note.view.radius, noteColor);
    drawRectangle(note.view.x - 2, note.view.y - 2, 4, 4, "black"); // dot in the center!
}

function drawRectangle(x, y, w, h, color) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.fillStyle = color;
    context.closePath();
    context.fill();
}

function drawLine(x1, y1, x2, y2, color, lineWidth = 2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.stroke();
}

function drawText(text) {
    context.font = "20px serif";
    context.fillText(text, 10, 20);
}

function drawDebug() {
    const windowStartLineY = crossLineY - accuracyDeltaMs * song.songVelocity;
    const windowEndLineY = crossLineY + accuracyDeltaMs * song.songVelocity;
    drawLine(0, windowStartLineY , 1000, windowStartLineY, "grey");
    drawLine(0, windowEndLineY, 1000, windowEndLineY, "grey");
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}