class Song {
    constructor(lane1, lane2) {
        this.lane1 = lane1;
        this.lane2 = lane2;

        this.songStartTime = 0;
        this.currentSongTimeMs = 0;
    }

    checkHit(accuracyDeltaMs, laneName) {
        const curSongTime = Date.now() - this.songStartTime;

        if (laneName === "Lane1") {
            this.checkHitOnLane(this.lane1, curSongTime, accuracyDeltaMs);
        } else if (laneName === "Lane2") {
            this.checkHitOnLane(this.lane2, curSongTime, accuracyDeltaMs);
        }
    }

    checkHitOnLane(lane, curSongTime, accuracyDeltaMs) {
        for (const note of lane) {
            note.checkHit(curSongTime, accuracyDeltaMs);
        }
    }

    update(crossLineY, noteVelocity) {
        this.currentSongTimeMs = Date.now() - this.songStartTime;

        this.moveNote(this.lane1);
        this.moveNote(this.lane2);
    }

    moveNote(lane) {
        for (const note of lane) {
            const noteStartingPosition = crossLineY - noteVelocity * note.time;
            note.view.y = noteVelocity * this.currentSongTimeMs + noteStartingPosition;
        }
    }
}
