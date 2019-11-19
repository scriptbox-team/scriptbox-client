export default class Camera {
    public x: number;
    public y: number;
    public viewWidth: number;
    public viewHeight: number;
    public xScale: number;
    public yScale: number;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.xScale = 1;
        this.yScale = 1;
    }
    public transform(x: number, y: number) {
        return {
            x: (x - this.x) * this.xScale + this.viewWidth / 2,
            y: (y - this.y) * this.yScale + this.viewHeight / 2
        };
    }
    public invTransform(x: number, y: number) {
        return {
            x: (x - this.viewWidth / 2) / this.xScale + this.x,
            y: (y - this.viewHeight / 2) / this.yScale + this.y
        };
    }
}
