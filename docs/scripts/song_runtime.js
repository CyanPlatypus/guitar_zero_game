class SongRuntime extends Song {
    static songVelocity = GameCanvas.canvasHeight / GameplaySettings.canvasVerticalPassTimeMs;

    static toNoteRuntimeArray(noteTimeArray, viewX) {
        return noteTimeArray.map(noteTime => 
            new NoteRuntime(noteTime, GameCanvas.crossLineY - SongRuntime.songVelocity * noteTime, viewX));
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
                note.view.y = SongRuntime.songVelocity * this.currentSongTimeMs + note.startingPosition;
            }
        }
    }
}
