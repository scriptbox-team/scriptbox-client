import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import RenderObject from "resource-management/render-object";

import Camera from "./camera";
import ScreenRenderer from "./screen-renderer";

/**
 * The proxy side of the ScreenRenderer.
 * This sends requests to the web side.
 *
 * @export
 * @class ScreenRendererProxy
 * @extends {ScreenRenderer}
 */
export default class ScreenRendererProxy extends ScreenRenderer {
    private _webContents: WebContents;
    /**
     * Creates an instance of ScreenRendererProxy.
     * @param {WebContents} webContents The WebContents to send calls to.
     * @memberof ScreenRendererProxy
     */
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
        ipcMain.on(ipcMessages.CameraChange, (event: any, cameraObject: object) => {
            if (this.reportCameraChange !== undefined) {
                const camera = Object.assign(new Camera(), cameraObject);
                this.reportCameraChange(camera);
            }
        });
    }
    /**
     * Add or update a render object on the screen.
     *
     * @param {string} resourceIP The IP to get resources from
     * @param {RenderObject} renderObject The render object to add or update
     * @memberof ScreenRenderer
     */
    public updateRenderObject(resourceIP: string, renderObject: RenderObject) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.RenderObjectUpdate, resourceIP, renderObject);
        }
    }
    /**
     * Remove a render object from the screen.
     *
     * @param {string} id The render object to remove's ID
     * @memberof ScreenRendererProxy
     */
    public removeRenderObject(id: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.RenderObjectDelete, id);
        }
    }
    /**
     * Update the screen.
     *
     * @memberof ScreenRenderer
     */
    public update() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.RenderUpdate);
        }
    }
    /**
     * Update the camera information.
     *
     * @param {number} x The new camera x
     * @param {number} y The new camera y
     * @param {number} xScale The new camera x scale
     * @param {number} yScale The new camera y scale
     * @memberof ScreenRendererProxy
     */
    public updateCamera(x: number, y: number, xScale: number, yScale: number) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.CameraUpdate, x, y, xScale, yScale);
        }
    }
}
