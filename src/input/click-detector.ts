import _ from "lodash";
import RenderObject from "resource-management/render-object";

export default class ClickDetector {
    public clickableObjects: Map<string, RenderObject>;
    constructor() {
        this.clickableObjects = new Map<string, RenderObject>();
    }
    public clickObjects(x: number, y: number): RenderObject[] {
        const objs = Array.from(this.clickableObjects.values());
        return _.transform(objs, (acc, clickable) => {
            const left = clickable.position.x;
            const top = clickable.position.y;
            const right = clickable.position.x + clickable.textureSubregion.width;
            const bottom = clickable.position.y + clickable.textureSubregion.height;

            if (x >= left && x < right && y >= top && y < bottom) {
                acc.push(clickable);
            }
        }, [] as RenderObject[])
            .reverse()
            .sort((a, b) => a.depth - b.depth);
    }
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
