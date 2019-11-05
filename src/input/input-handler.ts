import {DebugLogType, log} from "core/debug-logger";
import RenderObject from "resource-management/render-object";
import ClickDetector from "./click-detector";
import KeyInputEvent from "./key-input-event";
import MouseInputEvent from "./mouse-input-event";
import { ToolType } from "./tool-type";

/**
 * A class which takes inputs and performs callbacks based on the kind of input
 *
 * @export
 * @class InputHandler
 */
export default class InputHandler {
    // TODO: Replace all "| undefined" definitions possible with ? after var name
    public onKeyRelease: ((e: KeyInputEvent) => void) | undefined;
    public onKeyPress: ((e: KeyInputEvent) => void) | undefined;
    public onPlace: ((prefab: string, x: number, y: number) => void) | undefined;
    public onErase: ((id: string) => void) | undefined;
    public onEdit: ((id: string | undefined) => void) | undefined;

    private _clickDetector: ClickDetector = new ClickDetector();
    private _selectedObject: RenderObject | undefined;
    private _tool: ToolType = ToolType.Edit;

    public updateClickableEntities(objects: RenderObject[]) {
        this._clickDetector.updateClickableObjects(objects);
    }
    /**
     * Take an input press event and pass it to the appropriate callback
     *
     * @param {KeyInputEvent} event The event to pass
     * @memberof InputHandler
     */
    public handleKeyPress(event: KeyInputEvent) {
        log(DebugLogType.Input, "Key press: " + event.key);
        this.onKeyPress!(event);
    }
    /**
     * Take an input release event and pass it to the appropriate callback
     *
     * @param {KeyInputEvent} event The event to pass
     * @memberof InputHandler
     */
    public handleKeyRelease(event: KeyInputEvent) {
        log(DebugLogType.Input, "Key release: " + event.key);
        this.onKeyRelease!(event);
    }

    public handleMousePress(event: MouseInputEvent) {
        log(DebugLogType.Input, `Mouse press: ${event.button} at [${event.x}, ${event.y}]`);
        switch (this._tool) {
            case ToolType.Edit: {
                const ids = this._clickDetector.clickObjects(event.x, event.y);
                log(DebugLogType.Input, ids);
                if (ids.length <= 0) {
                    // If nothing was clicked, do nothing
                    return;
                }
                else if (this._selectedObject !== undefined) {
                    // If there is already a selected object
                    // Select the next one below it
                    // If it can't find it, it selects the top one (handily, findIndex returns -1 on failure)
                    let ind = ids.findIndex((obj) => obj === this._selectedObject) + 1;
                    if (ind >= ids.length) {
                        ind = 0;
                    }
                    this._selectedObject = ids[ind];
                }
                else {
                    // If there wasn't anything selected before, select the top one
                    this._selectedObject = ids[0];
                }
                log(DebugLogType.Input,
                    `Selected ${this._selectedObject === undefined ? "nothing" : this._selectedObject.ownerID}`);
                this.onEdit!(this._selectedObject !== undefined ? this._selectedObject.ownerID : undefined);
                break;
            }
            case ToolType.Place: {
                this.onPlace!("", event.x, event.y);
                break;
            }
            case ToolType.Erase: {
                const ids = this._clickDetector.clickObjects(event.x, event.y);
                if (ids.length > 0) {
                    log(DebugLogType.Input, `Deleting ID ${ids[0].ownerID}`);
                    if (ids[0].ownerID !== undefined) {
                        this.onErase!(ids[0].ownerID);
                    }
                }
                break;
            }
        }
    }

    public deselect() {
        this._selectedObject = undefined;
        this.onEdit!(this._selectedObject);
    }

    public handleMouseRelease(event: MouseInputEvent) {
        log(DebugLogType.Input, `Mouse release: ${event.button} at [${event.x}, ${event.y}]`);
    }

    public handleMouseMove(event: MouseInputEvent) {
        // There really should be a log for mouse movement here but
        // It would be pretty spammy so it's been omitted
    }
    public setTool(tool: ToolType) {
        this._tool = tool;
    }
}
