/*
 * This file is used to facilitate IPC communication for the electron version.
 * This passes things from the pure versions to the proxies and vice-versa.
 */
/* tslint:disable */
import "module-alias/register";
import ModuleAlias from "module-alias";
import * as path from "path";

ModuleAlias.addAliases({
    core: path.join(__dirname, "..", "core"),
    input: path.join(__dirname, "..", "input"),
    ipc: path.join(__dirname, "..", "ipc"),
    networking: path.join(__dirname, "..", "networking"),
    rendering: path.join(__dirname, "..", "rendering"),
    ui: path.join(__dirname, "..", "ui"),
    "resource-management": path.join(__dirname, "..", "resource-management")
  });

import "source-map-support/register";

import {setDebugLogTypes, DebugLogType} from "core/debug-logger";
import { ipcRenderer } from "electron";
import { ToolType } from "input/tool-type";
import WindowInput from "input/window-input-pure";
import RenderObject from "resource-management/render-object";
import ScreenRendererPure from "rendering/screen-renderer-pure";
import ipcMessages from "./ipc-messages";
import UIManagerPure from "ui/ui-manager-pure";
import ResourceAPIInterfacePure from "networking/resource-api-interface-pure";
import Resource from "resource-management/resource";
import { TokenType } from "networking/packets/server-token-packet";
/* tslint:enable */

const windowInputPure = new WindowInput();
const url = "http://localhost:7778";

// We need to set up the debug log types again because this is (possibly) a different context
// Could just make all the debug stuff go to the console or something
// But this will do good enough for now. This project probably won't require
// Anything super robust for debug output
setDebugLogTypes([]);

windowInputPure.onKeyPressed = (event) => {
    ipcRenderer.send(ipcMessages.KeyPress, event);
};
windowInputPure.onKeyReleased = (event) => {
    ipcRenderer.send(ipcMessages.KeyRelease, event);
};
windowInputPure.onMousePressed = (event) => {
    ipcRenderer.send(ipcMessages.MousePress, event);
};
windowInputPure.onMouseReleased = (event) => {
    ipcRenderer.send(ipcMessages.MouseRelease, event);
};
windowInputPure.onMouseMoved = (event) => {
    ipcRenderer.send(ipcMessages.MouseMove, event);
};

const screenRendererPure = new ScreenRendererPure(1920, 1080);

ipcRenderer.on(ipcMessages.RenderObjectUpdate, (event: any, renderObject: RenderObject) => {
    screenRendererPure.updateRenderObject(renderObject);
});
ipcRenderer.on(ipcMessages.RenderObjectDelete, (event: any, id: number) => {
    screenRendererPure.removeRenderObject(id);
});
ipcRenderer.on(ipcMessages.RenderUpdate, (event: any) => {
    screenRendererPure.update();
});

const uiManagerPure = new UIManagerPure();
uiManagerPure.onPlayerMessageEntry = (message: string) => {
    ipcRenderer.send(ipcMessages.PlayerMessageEntry, message);
};
uiManagerPure.onToolChange = (tool: ToolType) => {
    ipcRenderer.send(ipcMessages.ToolChange, tool);
};
uiManagerPure.onScriptRun = (resourceID: string, args: string) => {
    ipcRenderer.send(ipcMessages.RunScript, resourceID, args);
};

const fileSenderPure = new ResourceAPIInterfacePure();
fileSenderPure.onTokenRequest = (tokenType: TokenType) => {
    ipcRenderer.send(ipcMessages.ResourceAPITokenRequest, tokenType);
};
// Manually hook up the UI manager to the file sender so we don't have to go through the process
// This avoids copying + reviving the file information which would be a massive pain
uiManagerPure.onResourceUpload = (files: FileList, resourceID?: string) => {
    fileSenderPure.send(files, url, resourceID);
};
uiManagerPure.onResourceDelete = (resourceID: string) => {
    fileSenderPure.delete(resourceID, url);
};
uiManagerPure.onResourceInfoModify = (resourceID: string, property: string, value: string) => {
    ipcRenderer.send(ipcMessages.ResourceInfoModify, resourceID, property, value);
};

ipcRenderer.on(ipcMessages.UIRender, (event: any) => {
    uiManagerPure.render();
});
ipcRenderer.on(ipcMessages.ChatMessage, (event: any, message: string) => {
    uiManagerPure.addChatMessage(message);
});
ipcRenderer.on(ipcMessages.ResourceAPIToken, (event: any, token: number, tokenType: TokenType) => {
    fileSenderPure.supplyToken(token, tokenType);
});
ipcRenderer.on(ipcMessages.ResourceList, (event: any, resources: Resource[]) => {
    uiManagerPure.setResourceList(resources);
});
