class MenuBackground {
    static horSpeed = 0;
    static verSpeed = 0.2;
    static imageSource = "./assets/piano1.jpg";
    
    horShift = 0;
    verShift = 0;
    
    start() {
        this.canvas = document.getElementById("background-canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.image = new Image();
        this.image.src = MenuBackground.imageSource;
        this.image.addEventListener("load", (e) => {
            this.intervalId = setInterval(this.drawMenuBackground.bind(this), 15);
        });
    }

    stop() {
        clearInterval(this.intervalId);
    }

    drawMenuBackground() {
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        const imgWidth = this.image.width;
        const imgHeight = this.image.height;
    
        this.canvas.width = clientWidth;
        this.canvas.height = clientHeight;
    
        this.horShift = this.horShift < imgWidth ? this.horShift + MenuBackground.horSpeed : 0;
        this.verShift = this.verShift < imgHeight ? this.verShift + MenuBackground.verSpeed : 0;
    
        const cols = Math.ceil(clientWidth / imgWidth);
        const rows = Math.ceil(clientHeight / imgHeight);
    
        for (var col = -1; col < cols; col++) {
            for (var row = -1; row < rows; row++) {
                this.canvasContext.drawImage(this.image,
                    col * imgWidth + this.horShift, row * imgHeight + this.verShift);
            }
        }
    }
}