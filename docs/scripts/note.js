class Note {
    constructor(time) {
        this.time = time;
        this.isPressed = false;
    }

    checkHit(hitTime) {
        const curTime = hitTime - songStartTime;
        const delta = 250;
        const windowStart = this.time - delta;
        const windowEnd = this.time + delta;
        
        // Add check !note.isPressed
        if (curTime >= windowStart && curTime <= windowEnd) {
            this.isPressed = true;
            console.log("hit");
        }
        else
        {
            console.log("miss");
        }
    }
}
