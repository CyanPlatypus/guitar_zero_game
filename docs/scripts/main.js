window.addEventListener("load", onLoad);

const canvasVerticalPassTimeMs = 2000;
const crossLineY = 400;
const lineWidth = 80;
const noteWidth = 70;
const separatorWidth = 1;
const accuracyDeltaMs = 120;

var canvas;
var context;
var player;

var currentSong;

var songs;

var mainMenuScreen;
var menuBackground;
var gameScreen;
var pauseMenu;

var prevTime;
var isPause = false;
var intervalId;

function onLoad() {
    mainMenuScreen = document.getElementById("main-menu-screen");
    gameScreen = document.getElementById("game-screen");
    pauseMenu = document.getElementById("pause-menu");

    loadSongsIntoMenu();
    addEventListenersToPauseMenu();

    document.body.removeChild(mainMenuScreen);
    document.body.removeChild(pauseMenu);

    showMenu();
}

function showMenu() {
    document.body.removeChild(gameScreen);
    document.body.appendChild(mainMenuScreen);

    menuBackground = new MenuBackground();
    menuBackground.start();
}

function showGame(song) {
    currentSong = new SongRuntime(song,
        SongRuntime.toNoteRuntimeArray(song.lanes.Lane1, GameCanvas.line1x),
        SongRuntime.toNoteRuntimeArray(song.lanes.Lane2, GameCanvas.line2x),
        SongRuntime.toNoteRuntimeArray(song.lanes.Lane3, GameCanvas.line3x),
        SongRuntime.toNoteRuntimeArray(song.lanes.Lane4, GameCanvas.line4x)
    );

    menuBackground.stop();
    document.body.removeChild(mainMenuScreen);
    document.body.appendChild(gameScreen);

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.addEventListener("keydown", onKeyDown);

    player = new YT.Player('player', {
        height: '200',
        width: '400',
        videoId: currentSong.youtubeVideoId,
        events: {
            'onReady': startGame,
            // 'onStateChange': onPlayerStateChange
        }
    });
}

function startGame() {
    player.playVideo();
    prevTime = Date.now();
    intervalId = setInterval(gameLoop, 15);
}

function loadSongsIntoMenu() {
    const gravityFalls = new Song("Gravity Falls Theme", "-h5bYX5L-0s",
        [2000, 3000, 5000],
        [1000, 2000, 6000],
        [2000, 4000, 6000],
        [4000, 6000]);

    const lastChristmas = new Song("Last Christmas", "akXcsRr6o6c",
        [2000, 3000, 4000],
        [1000, 6000],
        [2000, 4000],
        [4000, 5000, 6000]);

    songs = [
        //loadGravityFalls()
        gravityFalls,
        lastChristmas
    ]

    const songListContainer = document.getElementById("main-menu-screen-song-list");

    for (const s of songs) {
        var button = document.createElement("div");
        button.innerHTML = s.title;
        button.classList.add("main-menu-screen-button");
        songListContainer.appendChild(button);

        button.addEventListener("click", () => { showGame(s); });
    }
}

function addEventListenersToPauseMenu() {
    var quitGameButton = document.getElementById("quit-game-button");
    var continueGameButton = document.getElementById("continue-game-button");
    //quitGameButton.addEventListener("click", () => { showGame(s); });
    continueGameButton.addEventListener("click", () => { togglePause(); });
}

function loadGravityFalls() {
    // const centerX = canvas.width / 2;
    // const songVelocity = canvas.height / canvasVerticalPassTimeMs;
    const canvasWidth = 1000;
    const canvasHeight = 500;
    const centerX = canvasWidth / 2;
    const songVelocity = canvasHeight / canvasVerticalPassTimeMs;
    const noteHeight = 2 * accuracyDeltaMs * songVelocity;
    
    const line1x = centerX - (lineWidth * 2 + separatorWidth * 1.5) + (lineWidth / 2);
    const line2x = centerX - (lineWidth + separatorWidth * 0.5) + (lineWidth / 2);
    const line3x = centerX + separatorWidth * 0.5 + (lineWidth / 2);
    const line4x = centerX + lineWidth + separatorWidth * 1.5 + (lineWidth / 2);

    return new Song(
        "Gravity Falls Theme",
        "-h5bYX5L-0s",
        songVelocity,
        [
            new Note(2000, new NoteView(line1x, 0, noteWidth, noteHeight), crossLineY, songVelocity),
            new Note(3000, new NoteView(line1x, 0, noteWidth, noteHeight), crossLineY, songVelocity),
            new Note(5000, new NoteView(line1x, 0, noteWidth, noteHeight), crossLineY, songVelocity)
        ],
        [
            new Note(1000, new NoteView(line2x, 0, noteWidth, noteHeight), crossLineY, songVelocity),
            new Note(2000, new NoteView(line2x, 0, noteWidth, noteHeight), crossLineY, songVelocity),
            new Note(6000, new NoteView(line2x, 0, noteWidth, noteHeight), crossLineY, songVelocity)
        ],
        [
            new Note(3000, new NoteView(line3x, 0, noteWidth, noteHeight), crossLineY, songVelocity),
            new Note(4000, new NoteView(line3x, 0, noteWidth, noteHeight), crossLineY, songVelocity),
            new Note(5000, new NoteView(line3x, 0, noteWidth, noteHeight), crossLineY, songVelocity)
        ],
        [
            new Note(4000, new NoteView(line4x, 0, noteWidth, noteHeight), crossLineY, songVelocity),
            new Note(6000, new NoteView(line4x, 0, noteWidth, noteHeight), crossLineY, songVelocity)
        ]
    );
}

function handlePauseButton(keyCode) {
    if (keyCode === "Escape") {
        togglePause();
    }
}

function togglePause() {
    isPause = !isPause;
    if (isPause) {
        pauseGame();
    }
    else {
        unpauseGame();
    }
}

function pauseGame() {
    document.body.appendChild(pauseMenu);
    clearInterval(intervalId);
    player.pauseVideo();
}

function unpauseGame() {
    document.body.removeChild(pauseMenu);
    startGame();
}

function handleGameplayButtons(keyCode) {
    if (isPause)
        return;

    if (keyCode === "KeyD") {
        currentSong.checkHit(accuracyDeltaMs, "Lane1");
    } else if (keyCode === "KeyF") {
        currentSong.checkHit(accuracyDeltaMs, "Lane2");
    } else if (keyCode === "KeyJ") {
        currentSong.checkHit(accuracyDeltaMs, "Lane3");
    } else if (keyCode === "KeyK") {
        currentSong.checkHit(accuracyDeltaMs, "Lane4");
    }
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

    const consumed = ["KeyD","KeyF", "KeyJ", "KeyK", "Escape"].includes(event.code);

    handlePauseButton(event.code)
    handleGameplayButtons(event.code)

    // Consume the event so it doesn't get handled twice
    if (consumed) {
        event.preventDefault();
    }
}

function gameLoop() {
    var curTime = Date.now();
    var elapsed = curTime - prevTime;

    updateState(elapsed);
    draw();

    prevTime = curTime;
}

function updateState(elapsed) {
    currentSong.update(elapsed);
}

function draw() {
    clearCanvas();

    drawText(currentSong.currentSongTimeMs);

    drawLaneBase();

    drawSong();

    // drawDebug();
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

function drawSong() {
    for ([laneName, laneNotes] of Object.entries(currentSong.lanes)) {
        for (const note of laneNotes){
            drawNote(note);
        }
    }
}

function drawNote(note) {
    drawX = note.view.x - NoteView.width / 2;
    drawY = note.view.y - NoteView.height / 2;

    const noteColor = note.isPressed ? "lightgrey" : "black";
    drawRectangle(drawX, drawY, NoteView.width, NoteView.height, noteColor);
    // drawRectangle(note.view.x - 2, note.view.y - 2, 4, 4, "black"); // dot in the center!
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
    const windowStartLineY = crossLineY - accuracyDeltaMs * currentSong.songVelocity;
    const windowEndLineY = crossLineY + accuracyDeltaMs * currentSong.songVelocity;
    drawLine(0, windowStartLineY , 1000, windowStartLineY, "grey");
    drawLine(0, windowEndLineY, 1000, windowEndLineY, "grey");
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
