import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginUI from "./login-ui";

/**
 * The proxy side of the login UI.
 * This sends commands to the browser side.
 *
 * @export
 * @class LoginUIProxy
 * @extends {LoginUI}
 */
export default class LoginUIProxy extends LoginUI {
    private _webContents: WebContents;
    /**
     * Creates an instance of LoginUIProxy.
     * @param {WebContents} webContents The WebContents to send calls to.
     * @memberof LoginUIProxy
     */
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
        ipcMain.on(ipcMessages.Login, (event: any, username: string, token: string) => {
            if (this.onLogin !== undefined) {
                this.onLogin(username, token);
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
    /**
     * Render the UI screen.
     *
     * @memberof LoginUIProxy
     */
    public render() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.LoginUIRender);
        }
    }
    /**
     * Set the current menu of the login UI screen.
     *
     * @param {string} menu The name of the menu to switch to.
     * @memberof LoginUIProxy
     */
    public setMenu(menu: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.LoginUIChangeMenu, menu);
        }
    }
    /**
     * Set the login status message.
     *
     * @param {string} newStatus The login status message to set.
     * @memberof LoginUIProxy
     */
    public setStatus(status: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetLoginStatus, status);
        }
    }
}
