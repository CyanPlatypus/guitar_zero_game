class SongRuntime extends Song {
    static songVelocity = GameCanvas.canvasHeight / GameplaySettings.canvasVerticalPassTimeMs;

    static toNoteRuntimeArray(noteTimeArray, viewX) {
        return noteTimeArray.map(noteTime => 
            new NoteRuntime(noteTime, GameCanvas.crossLineY - SongRuntime.songVelocity * noteTime, viewX));
    }

    constructor(newSong, lane1, lane2, lane3, lane4) {
        super(newSong.title, newSong.youtubeVideoId, lane1, lane2, lane3, lane4);
        
        this.currentSongTimeMs = 0;
    }

    checkHit(accuracyDeltaMs, laneName) {
        this.checkHitOnLane(this.lanes[laneName], accuracyDeltaMs);
    }

    checkHitOnLane(lane, accuracyDeltaMs) {
        for (const note of lane) {
            note.checkHit(this.currentSongTimeMs, accuracyDeltaMs);
        }
    }

    update(passedTime) {
        this.currentSongTimeMs += passedTime;
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
