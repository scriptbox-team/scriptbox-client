import { ipcMain } from "electron";
import ipcMessages from "ipc/ipc-messages";
import KeyInputEvent from "./key-input-event";
import WindowInput from "./window-input";

/**
 * A proxy used to get window input from WindowInputPure through the IPC for Electron
 *
 * @export
 * @class WindowInputProxy
 * @extends {WindowInput}
 */
export default class WindowInputProxy extends WindowInput {
    constructor() {
        super();
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
    }
}
