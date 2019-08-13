import { ipcMain, WebContents } from "electron";
import ipcMessages from "ipc/ipc-messages";
import UIManager from "./ui-manager";

export default class UIManagerProxy extends UIManager {
    private _webContents: WebContents;
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
        ipcMain.on(ipcMessages.PlayerMessageEntry, (event: any, message: string) => {
            if (this.onPlayerMessageEntry !== undefined) {
                this.onPlayerMessageEntry(message);
            }
        });
    }
    public render() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.UIRender);
        }
    }
    public receiveChatMessage(message: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ChatMessage, message);
        }
    }
}
