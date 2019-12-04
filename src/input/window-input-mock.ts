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
export default class WindowInputMock extends WindowInput {
    public queryGamepads() { }
}
