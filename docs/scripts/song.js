class Song {
    constructor(title, youtubeVideoId, songVelocity, lane1, lane2, lane3, lane4) {
        this.lanes = {
            "Lane1": lane1,
            "Lane2": lane2,
            "Lane3": lane3,
            "Lane4": lane4
        };

        this.title = title;
        this.youtubeVideoId = youtubeVideoId;
        this.songStartTime = 0;
        this.currentSongTimeMs = 0;
        this.songVelocity = songVelocity;
    }

    checkHit(accuracyDeltaMs, laneName) {
        const curSongTime = Date.now() - this.songStartTime;

        this.checkHitOnLane(this.lanes[laneName], curSongTime, accuracyDeltaMs);
    }

    checkHitOnLane(lane, curSongTime, accuracyDeltaMs) {
        for (const note of lane) {
            note.checkHit(curSongTime, accuracyDeltaMs);
        }
    }

    update() {
        this.currentSongTimeMs = Date.now() - this.songStartTime;
        this.moveNote();
    }

    moveNote() {
        for (const [laneName, laneNotes] of Object.entries(this.lanes)) {
            for (const note of laneNotes) {
                note.view.y = this.songVelocity * this.currentSongTimeMs + note.startingPosition;
            }
        }
    }
}


class GameplaySettings {
    static canvasVerticalPassTimeMs = 2000;
    static accuracyDeltaMs = 120;
}

class GameCanvas {
    static canvasWidth = 1000;
    static canvasHeight = 500;
    static crossLineY = 400;
    static lineWidth = 80;
    static separatorWidth = 1;
    static centerX = GameCanvas.canvasWidth / 2;
    static line1x = GameCanvas.centerX - (GameCanvas.lineWidth * 2 + GameCanvas.separatorWidth * 1.5) + (GameCanvas.lineWidth / 2);
    static line2x = GameCanvas.centerX - (GameCanvas.lineWidth + GameCanvas.separatorWidth * 0.5) + (GameCanvas.lineWidth / 2);
    static line3x = GameCanvas.centerX + GameCanvas.separatorWidth * 0.5 + (GameCanvas.lineWidth / 2);
    static line4x = GameCanvas.centerX + GameCanvas.lineWidth + GameCanvas.separatorWidth * 1.5 + (GameCanvas.lineWidth / 2);
}

class NewNoteView {
    static width = 70;
    static height = 2 * GameplaySettings.accuracyDeltaMs * GameCanvas.canvasHeight / GameplaySettings.canvasVerticalPassTimeMs;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class NewNoteRuntime {
    constructor(time, startingPosition, viewX) {
        this.time = time;
        this.startingPosition = startingPosition;
        this.view = new NewNoteView(viewX, 0);
        this.isPressed = false;
    }

    checkHit(curSongTime, accuracyDeltaMs) {

        const windowStart = this.time - accuracyDeltaMs;
        const windowEnd = this.time + accuracyDeltaMs;
        
        // Add check !note.isPressed
        if (curSongTime >= windowStart && curSongTime <= windowEnd) {
            this.isPressed = true;
            console.log("hit");
        }
        else
        {
            console.log("miss");
        }
    }
}

class NewSong {
    constructor(title, youtubeVideoId, lane1, lane2, lane3, lane4) {
        this.title = title;
        this.youtubeVideoId = youtubeVideoId;
        this.lanes = {Lane1: lane1, Lane2: lane2, Lane3: lane3, Lane4: lane4 };
    }
}

class NewSongRuntime extends NewSong {
    static songVelocity = GameCanvas.canvasHeight / GameplaySettings.canvasVerticalPassTimeMs;

    static toNoteRuntimeArray(noteTimeArray, viewX) {
        return noteTimeArray.map(noteTime => new NewNoteRuntime(noteTime, GameCanvas.crossLineY - NewSongRuntime.songVelocity * noteTime, viewX))
    }

    constructor(newSong, lane1, lane2, lane3, lane4) {
        super(newSong.title, newSong.youtubeVideoId, lane1, lane2, lane3, lane4);
        
        this.songStartTime = 0;
        this.currentSongTimeMs = 0;
    }

    checkHit(accuracyDeltaMs, laneName) {
        // todo: why do we compute curSongTime when we already have a prop currentSongTimeMs?
        const curSongTime = Date.now() - this.songStartTime;

        this.checkHitOnLane(this.lanes[laneName], curSongTime, accuracyDeltaMs);
    }

    checkHitOnLane(lane, curSongTime, accuracyDeltaMs) {
        for (const note of lane) {
            note.checkHit(curSongTime, accuracyDeltaMs);
        }
    }

    update() {
        this.currentSongTimeMs = Date.now() - this.songStartTime;
        this.moveNote();
    }

    moveNote() {
        for (const [laneName, laneNotes] of Object.entries(this.lanes)) {
            for (const note of laneNotes) {
                note.view.y = NewSongRuntime.songVelocity * this.currentSongTimeMs + note.startingPosition;
            }
        }
    }
}