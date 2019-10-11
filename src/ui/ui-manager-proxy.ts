import { ipcMain, WebContents } from "electron";
import { ToolType } from "input/tool-type";
import ipcMessages from "ipc/ipc-messages";
import ComponentInfo from "resource-management/component-info";
import Resource from "resource-management/resource";

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
        ipcMain.on(ipcMessages.ToolChange, (event: any, tool: ToolType) => {
            if (this.onToolChange !== undefined) {
                this.onToolChange(tool);
            }
        });
        ipcMain.on(ipcMessages.RunScript, (event: any, resourceID: string, args: string, entityID: string | null) => {
            if (this.onScriptRun !== undefined) {
                const fixedEntityID = entityID === null ? undefined : entityID;
                this.onScriptRun(resourceID, args, fixedEntityID);
            }
        });
        ipcMain.on(ipcMessages.ResourceInfoModify, (
                event: any,
                resourceID: string,
                attribute: string,
                value: string) => {
            if (this.onResourceInfoModify !== undefined) {
                this.onResourceInfoModify(resourceID, attribute, value);
            }
        });
        ipcMain.on(ipcMessages.DeleteComponent, (event: any, componentID: string) => {
            if (this.onComponentDelete !== undefined) {
                this.onComponentDelete(componentID);
            }
        });
    }
    public render() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.UIRender);
        }
    }
    public addChatMessage(message: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ChatMessage, message);
        }
    }
    public setResourceList(resources: Resource[]): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResourceList, resources);
        }
    }
    public inspect(entityID?: string): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetInspectEntity, entityID);
        }
    }
    public setEntityData(components: ComponentInfo[], entityID: string): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.UpdateEntityInspect, components, entityID);
        }
    }
}
