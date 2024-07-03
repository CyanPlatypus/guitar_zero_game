class Note {
    constructor(time, view) {
        this.time = time;
        this.isPressed = false;
        this.view = view;
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
