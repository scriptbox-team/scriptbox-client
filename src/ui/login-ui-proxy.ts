import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginUI from "./login-ui";

export default class LoginUIProxy extends LoginUI {
    private _webContents: WebContents;
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
        ipcMain.on(ipcMessages.Login, (event: any, username: string, password: string) => {
            if (this.onLogin !== undefined) {
                this.onLogin(username, password);
            }
        });
        ipcMain.on(ipcMessages.Signup, (event: any, username: string, email: string, password: string) => {
            if (this.onSignup !== undefined) {
                this.onSignup(username, email, password);
            }
        });
        ipcMain.on(ipcMessages.Connect, (event: any, ip: string) => {
            if (this.onConnect !== undefined) {
                this.onConnect(ip);
            }
        });
    }
    public render() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.LoginUIRender);
        }
    }
    public setMenu(menu: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.LoginUIChangeMenu, menu);
        }
    }
}
