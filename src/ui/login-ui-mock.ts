import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginUI from "./login-ui";

/**
 * A mock of the LoginUI.
 * This has no behaviour.
 *
 * @export
 * @class LoginUIMock
 * @extends {LoginUI}
 */
export default class LoginUIMock extends LoginUI {
    public render() { }
    public setStatus(status: string) { }
    public setMenu(menu: string) { }
}
