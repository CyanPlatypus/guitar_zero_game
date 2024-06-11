class Note {
    constructor(time) {
        this.time = time;
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
