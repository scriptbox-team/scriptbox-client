import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import { TokenType } from "./packets/server-token-packet";
import ResourceAPIInterface from "./resource-api-interface";

export default class ResourceAPIInterfaceProxy extends ResourceAPIInterface {
    private _webContents: WebContents;
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;

        ipcMain.on(ipcMessages.ResourceAPITokenRequest, (event: any, tokenType: TokenType) => {
            if (this.onTokenRequest !== undefined) {
                this.onTokenRequest(tokenType);
            }
        });
    }
    public send(fileList: FileList) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("FileSender functions should only be used browser-side"));
    }
    public delete(resourceID: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("FileSender functions should only be used browser-side"));
    }
    public supplyToken(token: number, tokenType: TokenType) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResourceAPIToken, token, tokenType);
        }
    }
    public setIP(url: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetupResourceIP, url);
        }
    }
}
