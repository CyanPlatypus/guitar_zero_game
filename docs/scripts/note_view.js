class NoteView {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    move(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
}
