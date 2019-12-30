import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import RenderObject from "resource-management/render-object";

import Camera from "./camera";
import ScreenRenderer from "./screen-renderer";

/**
 * A mock for the screen renderer.
 * This has no behaviour.
 *
 * @export
 * @class ScreenRendererMock
 * @extends {ScreenRenderer}
 */
export default class ScreenRendererMock extends ScreenRenderer {
    public updateRenderObject(resourceIP: string, renderObject: RenderObject) { }
    public removeRenderObject(id: string) { }
    public update() { }
    public updateCamera(x: number, y: number, xScale: number, yScale: number) { }
}
