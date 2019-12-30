import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import { TokenType } from "./packets/server-token-packet";
import ResourceAPIInterface from "./resource-api-interface";

/**
 * The proxy side of the Resource API interface.
 * This takes incoming commands and sends them to the appropriate place.
 *
 * @export
 * @class ResourceAPIInterfaceProxy
 * @extends {ResourceAPIInterface}
 */
export default class ResourceAPIInterfaceProxy extends ResourceAPIInterface {
    private _webContents: WebContents;
    /**
     * Creates an instance of ResourceAPIInterfaceProxy.
     * @param {WebContents} webContents The WebContents to send calls to.
     * @memberof ResourceAPIInterfaceProxy
     */
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;

        ipcMain.on(ipcMessages.ResourceAPITokenRequest, (event: any, tokenType: TokenType) => {
            if (this.onTokenRequest !== undefined) {
                this.onTokenRequest(tokenType);
            }
        });
    }
    /**
     * This exists to fulfill the class requirements.
     * DO NOT USE.
     *
     * @param {FileList} fileList
     * @returns
     * @memberof ResourceAPIInterfaceProxy
     */
    public send(fileList: FileList) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("FileSender functions should only be used browser-side"));
    }
    /**
     * This exists to fulfill the class requirements.
     * DO NOT USE.
     *
     * @param {string} resourceID
     * @returns
     * @memberof ResourceAPIInterfaceProxy
     */
    public delete(resourceID: string) {
        // This shouldn't happen since this should only be called browser-side
        // But if it is, just reject it
        return Promise.reject(new Error("FileSender functions should only be used browser-side"));
    }
    /**
     * Supply a token to use to send a request.
     * This will attach to whatever the top queued request is.
     *
     * @param {number} token The token to supply.
     * @param {TokenType} tokenType The type of the token to supply.
     * @memberof ResourceAPIInterfaceProxy
     */
    public supplyToken(token: number, tokenType: TokenType) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResourceAPIToken, token, tokenType);
        }
    }
    /**
     * Set the IP to use for the resource server.
     *
     * @param {string} url The URL of the resource server.
     * @memberof ResourceAPIInterfaceProxy
     */
    public setIP(url: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetupResourceIP, url);
        }
    }
}
