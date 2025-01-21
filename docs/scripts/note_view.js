class NoteView {
    static width = 70;
    static height = 2 * GameplaySettings.accuracyDeltaMs * GameCanvas.canvasHeight 
        / GameplaySettings.canvasVerticalPassTimeMs;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
