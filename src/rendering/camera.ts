/**
 * The game camera.
 * This contains its position and scale information, as well as its width and height.
 * This can also transform between world coordinates and screen-space coordinates.
 *
 * @export
 * @class Camera
 */
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
    /**
     * Transform a coordinate from world space to screen space.
     *
     * @param {number} x The world-space x coordinate.
     * @param {number} y The world-space y coordinate.
     * @returns The coordinates in screen space.
     * @memberof Camera
     */
    public transform(x: number, y: number) {
        return {
            x: (x - this.x) * this.xScale + this.viewWidth / 2,
            y: (y - this.y) * this.yScale + this.viewHeight / 2
        };
    }
    /**
     * Transform a coordinate from screen space to world space.
     *
     * @param {number} x The screen-space x coordinate.
     * @param {number} y The screen-space y coordinate.
     * @returns The coordinates in world space.
     * @memberof Camera
     */
    public invTransform(x: number, y: number) {
        return {
            x: (x - this.viewWidth / 2) / this.xScale + this.x,
            y: (y - this.viewHeight / 2) / this.yScale + this.y
        };
    }
}
