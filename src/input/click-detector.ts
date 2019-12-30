import _ from "lodash";
import Camera from "rendering/camera";
import RenderObject from "resource-management/render-object";

/**
 * A detector that determines whether a render object has been clicked on.
 *
 * @export
 * @class ClickDetector
 */
export default class ClickDetector {
    public clickableObjects: Map<string, RenderObject>;
    /**
     * Creates an instance of ClickDetector.
     * @memberof ClickDetector
     */
    constructor() {
        this.clickableObjects = new Map<string, RenderObject>();
    }
    /**
     * Click on a particular location on the screen, and return any objects which
     * have been clicked on.
     *
     * @param {Camera} camera The camera the screen is using.
     * @param {number} x The x position that was clicked.
     * @param {number} y The y position that was clicked.
     * @returns {RenderObject[]} The render objects which were clicked on.
     * @memberof ClickDetector
     */
    public clickObjects(camera: Camera, x: number, y: number): RenderObject[] {
        const objs = Array.from(this.clickableObjects.values());
        return _.transform(objs, (acc, clickable) => {
            const transformedTopLeft = camera.transform(
                clickable.position.x,
                clickable.position.y
            );
            const transformedBottomRight = camera.transform(
                clickable.position.x + clickable.textureSubregion.width * clickable.scale.x,
                clickable.position.y + clickable.textureSubregion.height * clickable.scale.y
            );

            if (transformedBottomRight.x < transformedTopLeft.x) {
                const tmp = transformedBottomRight.x;
                transformedBottomRight.x = transformedTopLeft.x;
                transformedTopLeft.x = tmp;
            }

            if (transformedBottomRight.y < transformedTopLeft.y) {
                const tmp = transformedBottomRight.y;
                transformedBottomRight.y = transformedTopLeft.y;
                transformedTopLeft.y = tmp;
            }

            if (x >= transformedTopLeft.x && x < transformedBottomRight.x
                    && y >= transformedTopLeft.y && y < transformedBottomRight.y) {
                acc.push(clickable);
            }
        }, [] as RenderObject[])
            .reverse()
            .sort((a, b) => a.depth - b.depth);
    }
    /**
     * Update the detector's clickable object list.
     *
     * @param {RenderObject[]} objects The list of objects that can be clicked.
     * @memberof ClickDetector
     */
    public updateClickableObjects(objects: RenderObject[]) {
        for (const object of objects) {
            if (object.deleted) {
                this.clickableObjects.delete(object.id);
            }
            else {
                this.clickableObjects.set(object.id, object);
            }
        }
    }
}
