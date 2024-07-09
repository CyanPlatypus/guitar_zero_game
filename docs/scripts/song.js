class Song {
    constructor(notes) {
        this.notes = notes;
    }

    checkHit(curSongTime, accuracyDeltaMs) {
        for (const note of song.notes) {
            note.checkHit(curSongTime, accuracyDeltaMs);
        }
    }
}
