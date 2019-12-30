import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginAPIInterface from "./login-api-interface";

/**
 * The proxy side of the LoginAPIInterface.
 * This takes incoming commands and sends them to the appropriate place.
 * However, login() and signup() should not be used.
 *
 * @export
 * @class LoginAPIInterfaceProxy
 * @extends {LoginAPIInterface}
 */
export default class LoginAPIInterfaceProxy extends LoginAPIInterface {
    private _webContents: WebContents;
    /**
     * Creates an instance of LoginAPIInterfaceProxy.
     * @param {WebContents} webContents The webcontents to send calls to.
     * @memberof LoginAPIInterfaceProxy
     */
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
    }
    /**
     * Exists to satisfy the class requirements.
     * DO NOT USE.
     *
     * @param {string} username
     * @param {string} password
     * @returns
     * @memberof LoginAPIInterfaceProxy
     */
    public login(username: string, password: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    /**
     * Exists to satisfy the class requirements.
     * DO NOT USE.
     *
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @returns
     * @memberof LoginAPIInterfaceProxy
     */
    public signup(username: string, email: string, password: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    /**
     * Set the URL to use for the login server.
     *
     * @param {string} ip The IP to use
     * @memberof LoginAPIInterfaceProxy
     */
    public setURL(url: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetupLoginURL, url);
        }
    }
}
