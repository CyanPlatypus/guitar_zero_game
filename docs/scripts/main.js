window.addEventListener("load", onLoad);

const crossLineY = 400;
const lineWidth = 80;
const separatorWidth = 1;

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

    const dawnPatrol = new Song("Dawn Patrol", "Zp0Ur59M8HY",
        [14600, 16200, 17800, 20400, 21000, 22600, 24200, 25800, 27400, 29000, 30600, 33200, 33800, 35400, 37000, 39000, 40200, 41800, 43400, 46000, 46600, 48200, 49800, 51400, 53000, 54600, 56200, 58800, 59400, 61000, 62600, 64600],
        [14200, 15800, 17400, 19600, 19800, 20200, 20600, 22200, 23800, 25400, 27000, 28600, 30200, 32400, 32600, 33000, 33400, 35000, 36600, 38600, 39800, 41400, 43000, 45200, 45400, 45800, 46200, 47800, 49400, 51000, 52600, 54200, 55800, 58000, 58200, 58600, 59000, 60600, 62200, 64200],
        [14400, 15000, 15400, 15600, 17600, 18200, 18600, 18800, 19000, 19400, 20000, 20800, 21400, 21800, 22000, 24000, 24600, 25000, 25600, 26600, 27200, 27800, 28200, 28400, 30400, 31000, 31400, 31600, 31800, 32200, 32800, 33600, 34200, 34600, 34800, 36800, 37400, 37800, 38400, 40000, 40600, 41000, 41200, 43200, 43800, 44200, 44400, 44600, 45000, 45600, 46400, 47000, 47400, 47600, 49600, 50200, 50600, 51200, 52200, 52800, 53400, 53800, 54000, 56000, 56600, 57000, 57200, 57400, 57800, 58400, 59200, 59800, 60200, 60400, 62400, 63000, 63400, 64000],
        [16000, 16600, 17000, 17200, 19200, 22400, 23000, 23400, 23600, 26200, 28800, 29400, 29800, 30000, 32000, 35200, 35800, 36200, 36400, 38200, 41600, 42200, 42600, 42800, 44800, 48000, 48600, 49000, 49200, 51800, 54400, 55000, 55400, 55600, 57600, 60800, 61400, 61800, 62000, 63800]
    );

    songs = [
        gravityFalls,
        lastChristmas,
        dawnPatrol
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
    quitGameButton.addEventListener("click", () => { exitGame(); });
    continueGameButton.addEventListener("click", () => { togglePause(); });
}

function exitGame() {
    if (isPause) {
        document.body.removeChild(pauseMenu);
    }
    else {
        clearInterval(intervalId);
    }

    isPause = false;
    player.destroy();
    window.removeEventListener("keydown", onKeyDown);
    clearCanvas();
    showMenu();
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
        currentSong.checkHit(GameplaySettings.accuracyDeltaMs, "Lane1");
    } else if (keyCode === "KeyF") {
        currentSong.checkHit(GameplaySettings.accuracyDeltaMs, "Lane2");
    } else if (keyCode === "KeyJ") {
        currentSong.checkHit(GameplaySettings.accuracyDeltaMs, "Lane3");
    } else if (keyCode === "KeyK") {
        currentSong.checkHit(GameplaySettings.accuracyDeltaMs, "Lane4");
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
    const windowStartLineY = crossLineY - GameplaySettings.accuracyDeltaMs * currentSong.songVelocity;
    const windowEndLineY = crossLineY + GameplaySettings.accuracyDeltaMs * currentSong.songVelocity;
    drawLine(0, windowStartLineY , 1000, windowStartLineY, "grey");
    drawLine(0, windowEndLineY, 1000, windowEndLineY, "grey");
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
