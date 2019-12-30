import { ipcMain, WebContents } from "electron";
import { ToolType } from "input/tool-type";
import ipcMessages from "ipc/ipc-messages";
import ComponentInfo from "resource-management/component-info";
import Resource from "resource-management/resource";

import GameUI from "./game-ui";

/**
 * A mock of the Game UI.
 * This has no behaviour.
 *
 * @export
 * @class GameUIMock
 * @extends {GameUI}
 */
export default class GameUIMock extends GameUI {
    public render() { }
    public addChatMessage(message: string) { }
    public setResourceList(resources: Resource[]): void { }
    public inspect(entityID: string | undefined): void { }
    public setEntityData(components: ComponentInfo[], entityID: string, controlled: boolean): void { }
    public setResourceRepoList(resources: Resource[], search: string): void { }
    public setEditingScriptText(scriptID: string, script: string): void { }
}
