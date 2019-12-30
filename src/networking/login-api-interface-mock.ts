import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginAPIInterface from "./login-api-interface";

/**
 * A mock for the LoginAPIInterface.
 * This has no behaviour.
 *
 * @export
 * @class LoginAPIInterfaceMock
 * @extends {LoginAPIInterface}
 */
export default class LoginAPIInterfaceMock extends LoginAPIInterface {
    public login(username: string, password: string) {
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    public signup(username: string, email: string, password: string) {
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    public setURL(url: string) {
    }
}
