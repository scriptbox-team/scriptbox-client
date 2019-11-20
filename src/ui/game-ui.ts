import { ToolType } from "input/tool-type";
import ComponentInfo from "resource-management/component-info";
import Resource from "resource-management/resource";
import UIScreen from "./ui-screen";

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
    public abstract addChatMessage(message: string): void;
    public abstract setResourceList(resources: Resource[]): void;
    public abstract inspect(entityID: string | undefined): void;
    public abstract setEntityData(components: ComponentInfo[], entityID: string, controlled: boolean): void;
    public abstract setResourceRepoList(resources: Resource[], search: string): void;
    public abstract setEditingScriptText(scriptID: string, script: string): void;
}
