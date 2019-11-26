import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import { TokenType } from "./packets/server-token-packet";
import ResourceAPIInterface from "./resource-api-interface";

export default class ResourceAPIInterfaceMock extends ResourceAPIInterface {
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
    public supplyToken(token: number, tokenType: TokenType) { }
    public setIP(url: string) { }
}
