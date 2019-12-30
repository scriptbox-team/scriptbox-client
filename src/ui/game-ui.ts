import { ToolType } from "input/tool-type";
import ComponentInfo from "resource-management/component-info";
import Resource from "resource-management/resource";
import UIScreen from "./ui-screen";

/**
 * The UI for the main game.
 * This class contains many callbacks for affordances in the UI.
 *
 * @export
 * @abstract
 * @class GameUI
 * @extends {UIScreen}
 */
export default abstract class GameUI extends UIScreen {
    public onPlayerMessageEntry?: (message: string) => void;
    public onToolChange?: (tool: ToolType) => void;
    public onResourceUpload?: (files: FileList, resourceID?: string) => void;
    public onResourceDelete?: (resourceID: string) => void;
    public onScriptRun?: (resourceID: string, args: string, entityID?: string) => void;
    public onResourceInfoModify?: (resourceID: string, attribute: string, value: string) => void;
    public onComponentDelete?: (componentID: string) => void;
    public onEntityControl?: (entityID: string | undefined) => void;
    public onComponentEnableState?: (componentID: string, state: boolean) => void;
    public onCloneResource?: (resourceID: string) => void;
    public onSearchResourceRepo?: (search: string) => void;
    public onRequestEditScript?: (scriptID: string) => void;
    public onEditScript?: (scriptID: string, script: string) => void;
    public onModifyComponentMeta?: (componentID: string, option: string, value: string) => void;
    public onMakePrefab?: (entityID: string) => void;
    public onResourceSelect?: (resourceID: string | undefined) => void;
    /**
     * Add an incoming chat message to the chat.
     *
     * @abstract
     * @param {string} message The message to add.
     * @memberof GameUI
     */
    public abstract addChatMessage(message: string): void;
    /**
     * Set the player resource listing.
     *
     * @abstract
     * @param {Resource[]} resources The list of resources to set for the player list.
     * @memberof GameUI
     */
    public abstract setResourceList(resources: Resource[]): void;
    /**
     * Set the entity inspection
     *
     * @abstract
     * @param {(string | undefined)} entityID The ID of the entity to inspect or undefined to not inspect anything
     * @memberof GameUI
     */
    public abstract inspect(entityID: string | undefined): void;
    /**
     * Set the data of the entity being inspected
     *
     * @abstract
     * @param {ComponentInfo[]} components The components of the inspected entity
     * @param {string} entityID The ID of the received inspection data, used for checking purposes
     * @param {boolean} controlled Whether the client is controlling the entity or not
     * @memberof GameUI
     */
    public abstract setEntityData(components: ComponentInfo[], entityID: string, controlled: boolean): void;
    /**
     * Set the shared resource repository listing.
     *
     * @abstract
     * @param {Resource[]} resources The list of resources to set for the repository.
     * @param {string} search The search that the resource came from, used for checking purposes.
     * @memberof GameUI
     */
    public abstract setResourceRepoList(resources: Resource[], search: string): void;
    /**
     * Set the text of the script currently being edited.
     *
     * @abstract
     * @param {string} scriptID The ID of the script being edited, used for checking purposes.
     * @param {string} script The script text
     * @memberof GameUI
     */
    public abstract setEditingScriptText(scriptID: string, script: string): void;
}
