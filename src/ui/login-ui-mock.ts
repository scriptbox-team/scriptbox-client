import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginUI from "./login-ui";

export default class LoginUIMock extends LoginUI {
    public render() { }
    public setMenu(menu: string) { }
}
