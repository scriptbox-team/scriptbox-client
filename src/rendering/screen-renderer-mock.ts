import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import RenderObject from "resource-management/render-object";

import Camera from "./camera";
import ScreenRenderer from "./screen-renderer";

export default class ScreenRendererMock extends ScreenRenderer {
    public updateRenderObject(resourceIP: string, renderObject: RenderObject) { }
    public removeRenderObject(id: string) { }
    public update() { }
    public updateCamera(x: number, y: number, xScale: number, yScale: number) { }
}
