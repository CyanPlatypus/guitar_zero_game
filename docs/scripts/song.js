class Song {
    constructor(songVelocity, lane1, lane2) {
        this.lanes = {
            "Lane1": lane1,
            "Lane2": lane2
        };

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

        this.moveNote(this.lane1);
        this.moveNote(this.lane2);
    }

    moveNote() {
        for (const [laneName, laneNotes] of Object.entries(this.lanes)) {
            for (const note of laneNotes) {
                const noteStartingPosition = crossLineY - this.songVelocity * note.time;
                note.view.y = this.songVelocity * this.currentSongTimeMs + noteStartingPosition;
            }
        }
    }
}
