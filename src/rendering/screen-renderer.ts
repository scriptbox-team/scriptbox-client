import RenderObject from "resource-management/render-object";
import Camera from "./camera";

/**
 * A screen renderer.
 * This takes render objects and displays them on the screen.
 *
 * @export
 * @abstract
 * @class ScreenRenderer
 */
export default abstract class ScreenRenderer {
    public reportCameraChange?: (camera: Camera) => void;
    /**
     * Add or update a render object on the screen.
     *
     * @abstract
     * @param {string} resourceIP The IP to get resources from
     * @param {RenderObject} renderObject The render object to add or update
     * @memberof ScreenRenderer
     */
    public abstract updateRenderObject(resourceIP: string, renderObject: RenderObject): void;
    /**
     * Remove a render object from the screen.
     *
     * @abstract
     * @param {string} id The render object to remove's ID
     * @memberof ScreenRenderer
     */
    public abstract removeRenderObject(id: string): void;
    /**
     * Update the screen.
     *
     * @abstract
     * @memberof ScreenRenderer
     */
    public abstract update(): void;
    /**
     * Update the camera information.
     *
     * @abstract
     * @param {number} x The new camera x
     * @param {number} y The new camera y
     * @param {number} xScale The new camera x scale
     * @param {number} yScale The new camera y scale
     * @memberof ScreenRenderer
     */
    public abstract updateCamera(x: number, y: number, xScale: number, yScale: number): void;
}
