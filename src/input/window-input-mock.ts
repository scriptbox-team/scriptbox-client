import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import KeyInputEvent from "./key-input-event";
import MouseInputEvent from "./mouse-input-event";
import WindowInput from "./window-input";

/**
 * A mock for a WindowInput that doesn't have any behaviour.
 *
 * @export
 * @class WindowInputProxy
 * @extends {WindowInput}
 */
export default class WindowInputMock extends WindowInput {
    public queryGamepads() { }
}
