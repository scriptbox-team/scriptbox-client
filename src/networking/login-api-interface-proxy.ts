import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginAPIInterface from "./login-api-interface";

export default class LoginAPIInterfaceProxy extends LoginAPIInterface {
    private _webContents: WebContents;
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
    }
    public login(username: string, password: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    public signup(username: string, email: string, password: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    public setIP(url: string) {
        if (!this._webContents.isDestroyed()) {
            console.log(url);
            this._webContents.send(ipcMessages.SetupLoginIP, url);
        }
    }
}
