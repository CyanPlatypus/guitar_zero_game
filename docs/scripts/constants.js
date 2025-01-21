
class GameplaySettings {
    static canvasVerticalPassTimeMs = 2000;
    static accuracyDeltaMs = 120;
}

class GameCanvas {
    static canvasWidth = 1000;
    static canvasHeight = 500;
    static crossLineY = 400;
    static lineWidth = 80;
    static separatorWidth = 1;
    static centerX = GameCanvas.canvasWidth / 2;
    static line1x = GameCanvas.centerX - (GameCanvas.lineWidth * 2 + GameCanvas.separatorWidth * 1.5) + (GameCanvas.lineWidth / 2);
    static line2x = GameCanvas.centerX - (GameCanvas.lineWidth + GameCanvas.separatorWidth * 0.5) + (GameCanvas.lineWidth / 2);
    static line3x = GameCanvas.centerX + GameCanvas.separatorWidth * 0.5 + (GameCanvas.lineWidth / 2);
    static line4x = GameCanvas.centerX + GameCanvas.lineWidth + GameCanvas.separatorWidth * 1.5 + (GameCanvas.lineWidth / 2);
}
