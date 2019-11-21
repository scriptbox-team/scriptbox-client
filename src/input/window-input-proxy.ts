import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import KeyInputEvent from "./key-input-event";
import MouseInputEvent from "./mouse-input-event";
import WindowInput from "./window-input";

/**
 * A proxy used to get window input from WindowInputPure through the IPC for Electron
 *
 * @export
 * @class WindowInputProxy
 * @extends {WindowInput}
 */
export default class WindowInputProxy extends WindowInput {
    private _webContents: WebContents;
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
        ipcMain.on(ipcMessages.KeyPress, (event: any, inputEvent: KeyInputEvent) => {
            if (this.onKeyPressed !== undefined) {
                this.onKeyPressed(inputEvent);
            }
        });
        ipcMain.on(ipcMessages.KeyRelease, (event: any, inputEvent: KeyInputEvent) => {
            if (this.onKeyReleased !== undefined) {
                this.onKeyReleased(inputEvent);
            }
        });
        ipcMain.on(ipcMessages.MousePress, (event: any, inputEvent: MouseInputEvent) => {
            if (this.onMousePressed !== undefined) {
                this.onMousePressed(inputEvent);
            }
        });
        ipcMain.on(ipcMessages.MouseRelease, (event: any, inputEvent: MouseInputEvent) => {
            if (this.onMouseReleased !== undefined) {
                this.onMouseReleased(inputEvent);
            }
        });
        ipcMain.on(ipcMessages.MouseMove, (event: any, inputEvent: MouseInputEvent) => {
            if (this.onMouseMoved !== undefined) {
                this.onMouseMoved(inputEvent);
            }
        });
    }
    public queryGamepads() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.QueryGamepads);
        }
    }
}
