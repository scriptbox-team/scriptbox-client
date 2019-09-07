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
    public send(fileList: FileList, url: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("FileSender should only be used browser-side"));
    }
    public delete(resourceID: string, url: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("FileSender should only be used browser-side"));
    }
    public supplyToken(token: number, tokenType: TokenType) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResourceAPIToken, token, tokenType);
        }
    }
}
