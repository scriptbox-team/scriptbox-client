import { ipcMain, WebContents } from "electron";
import { ToolType } from "input/tool-type";
import ipcMessages from "ipc/ipc-messages";
import ComponentInfo from "resource-management/component-info";
import Resource from "resource-management/resource";

import GameUI from "./game-ui";

/**
 * The proxy side of the game UI.
 * This sends commands to the browser side.
 *
 * @export
 * @class GameUIProxy
 * @extends {GameUI}
 */
export default class GameUIProxy extends GameUI {
    private _webContents: WebContents;
    /**
     * Creates an instance of GameUIProxy.
     * @param {WebContents} webContents The WebContents to send calls to.
     * @memberof GameUIProxy
     */
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
        ipcMain.on(ipcMessages.ModifyComponentMeta, (
                event: any,
                componentID: string,
                option: string,
                value: string) => {
            if (this.onModifyComponentMeta !== undefined) {
                this.onModifyComponentMeta(componentID, option, value);
            }
        });
        ipcMain.on(ipcMessages.CreatePrefab, (event: any, entityID: string) => {
            if (this.onMakePrefab !== undefined) {
                this.onMakePrefab(entityID);
            }
        });
        ipcMain.on(ipcMessages.ResourceSelect, (event: any, resourceID: string) => {
            if (this.onResourceSelect !== undefined) {
                this.onResourceSelect(resourceID !== null ? resourceID : undefined);
            }
        });
    }
    /**
     * Render the UI screen.
     *
     * @memberof GameUIProxy
     */
    public render() {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.GameUIRender);
        }
    }
    /**
     * Add an incoming chat message to the chat.
     *
     * @param {string} message The message to add.
     * @memberof GameUIProxy
     */
    public addChatMessage(message: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ChatMessage, message);
        }
    }
    /**
     * Set the player resource listing.
     *
     * @param {Resource[]} resources The list of resources to set for the player list.
     * @memberof GameUIProxy
     */
    public setResourceList(resources: Resource[]): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResourceList, resources);
        }
    }
    /**
     * Set the entity inspection
     *
     * @param {(string | undefined)} entityID The ID of the entity to inspect or undefined to not inspect anything
     * @memberof GameUIProxy
     */
    public inspect(entityID: string | undefined): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetInspectEntity, entityID);
        }
    }
    /**
     * Set the data of the entity being inspected
     *
     * @param {ComponentInfo[]} components The components of the inspected entity
     * @param {string} entityID The ID of the received inspection data, used for checking purposes
     * @param {boolean} controlled Whether the client is controlling the entity or not
     * @memberof GameUIProxy
     */
    public setEntityData(components: ComponentInfo[], entityID: string, controlled: boolean): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.UpdateEntityInspect, components, entityID, controlled);
        }
    }
    /**
     * Set the shared resource repository listing.
     *
     * @param {Resource[]} resources The list of resources to set for the repository.
     * @param {string} search The search that the resource came from, used for checking purposes.
     * @memberof GameUIProxy
     */
    public setResourceRepoList(resources: Resource[], search: string): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResourceRepoList, resources, search);
        }
    }
    /**
     * Set the text of the script currently being edited.
     *
     * @param {string} scriptID The ID of the script being edited, used for checking purposes.
     * @param {string} script The script text
     * @memberof GameUIProxy
     */
    public setEditingScriptText(scriptID: string, script: string): void {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ScriptText, scriptID, script);
        }
    }
}
