import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import RenderObject from "resource-management/render-object";

import Camera from "./camera";
import ScreenRenderer from "./screen-renderer";

export default class ScreenRendererProxy extends ScreenRenderer {
    private _webContents: WebContents;
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
    public updateRenderObject(resourceIP: string, renderObject: RenderObject) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.RenderObjectUpdate, resourceIP, renderObject);
        }
    }
    public removeRenderObject(id: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.RenderObjectDelete, id);
        }
    }
    public update() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.RenderUpdate);
        }
    }
    public updateCamera(x: number, y: number, xScale: number, yScale: number) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.CameraUpdate, x, y, xScale, yScale);
        }
    }
}
