import { ipcMain, WebContents } from "electron";
import { ToolType } from "input/tool-type";
import ipcMessages from "ipc/ipc-messages";
import ComponentInfo from "resource-management/component-info";
import Resource from "resource-management/resource";

import GameUI from "./game-ui";

export default class GameUIProxy extends GameUI {
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
        ipcMain.on(ipcMessages.DeleteComponent, (event: any, componentID: string) => {
            if (this.onComponentDelete !== undefined) {
                this.onComponentDelete(componentID);
            }
        });
        ipcMain.on(ipcMessages.SetComponentEnableState, (event: any, componentID: string, state: boolean) => {
            if (this.onComponentEnableState !== undefined) {
                this.onComponentEnableState(componentID, state);
            }
        });
        ipcMain.on(ipcMessages.SetEntityControl, (event: any, componentID: string | undefined) => {
            if (this.onEntityControl !== undefined) {
                this.onEntityControl(componentID !== null ? componentID : undefined);
            }
        });
        ipcMain.on(ipcMessages.CloneResource, (event: any, resourceID: string) => {
            if (this.onCloneResource !== undefined) {
                this.onCloneResource(resourceID);
            }
        });
        ipcMain.on(ipcMessages.SearchResourceRepo, (event: any, search: string) => {
            if (this.onSearchResourceRepo !== undefined) {
                this.onSearchResourceRepo(search);
            }
        });
        ipcMain.on(ipcMessages.RequestEditScript, (event: any, scriptID: string) => {
            if (this.onRequestEditScript !== undefined) {
                this.onRequestEditScript(scriptID);
            }
        });
        ipcMain.on(ipcMessages.EditScript, (event: any, scriptID: string, script: string) => {
            if (this.onEditScript !== undefined) {
                this.onEditScript(scriptID, script);
            }
        });
    }
    public render() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.GameUIRender);
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
    public inspect(entityID: string | undefined): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetInspectEntity, entityID);
        }
    }
    public setEntityData(components: ComponentInfo[], entityID: string, controlled: boolean): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.UpdateEntityInspect, components, entityID, controlled);
        }
    }
    public setResourceRepoList(resources: Resource[], search: string): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResourceRepoList, resources, search);
        }
    }
    public setEditingScriptText(scriptID: string, script: string): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ScriptText, scriptID, script);
        }
    }
}
