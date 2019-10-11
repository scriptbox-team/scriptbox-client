import {WebContents} from "electron";
import ipcMessages from "ipc/ipc-messages";
import RenderObject from "resource-management/render-object";
import ScreenRenderer from "./screen-renderer";

export default class ScreenRendererProxy extends ScreenRenderer {
    private _webContents: WebContents;
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
    }
    public updateRenderObject(renderObject: RenderObject) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.RenderObjectUpdate, renderObject);
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
}
