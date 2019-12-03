import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";

import LoginAPIInterface from "./login-api-interface";

export default class LoginAPIInterfaceMock extends LoginAPIInterface {
    public login(username: string, password: string) {
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    public signup(username: string, email: string, password: string) {
        return Promise.reject(new Error("LoginAPIInterface functions should only be used browser-side"));
    }
    public setIP(url: string) {
    }
}
