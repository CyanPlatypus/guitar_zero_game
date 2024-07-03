class NoteView {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    move(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}
