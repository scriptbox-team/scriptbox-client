import { ToolType } from "input/tool-type";
import Resource from "resource-management/resource";

export default abstract class UIManager {
    public onPlayerMessageEntry?: (message: string) => void;
    public onToolChange?: (tool: ToolType) => void;
    public onResourceUpload?: (files: FileList, resourceID?: string) => void;
    public onResourceDelete?: (resourceID: string) => void;
    public onScriptRun?: (resourceID: string, args: string) => void;
    public onResourceInfoModify?: (resourceID: string, attribute: string, value: string) => void;
    public abstract render(): void;
    public abstract addChatMessage(message: string): void;
    public abstract setResourceList(resources: Resource[]): void;
}
