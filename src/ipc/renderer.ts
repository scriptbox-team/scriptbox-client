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
import GameUIPure from "ui/game-ui-pure";
import ResourceAPIInterfacePure from "networking/resource-api-interface-pure";
import Resource from "resource-management/resource";
import { TokenType } from "networking/packets/server-token-packet";
import ComponentInfo from "resource-management/component-info";
import LoginUIPure from "ui/login-ui-pure";
import Camera from "rendering/camera";
/* tslint:enable */

const windowInputPure = new WindowInput();

// We need to set up the debug log types again because this is (possibly) a different context
// Could just make all the debug stuff go to the console or something
// But this will do good enough for now. This project probably won't require
// Anything super robust for debug output
setDebugLogTypes([]);

function undefinedIfNull<T>(kind: T | null) {
    if (kind === null) {
        return undefined;
    }
    return kind;
}

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

ipcRenderer.on(ipcMessages.RenderObjectUpdate, (event: any, resourceIP: string, renderObject: RenderObject) => {
    screenRendererPure.updateRenderObject(resourceIP, renderObject);
});
ipcRenderer.on(ipcMessages.RenderObjectDelete, (event: any, id: string) => {
    screenRendererPure.removeRenderObject(id);
});
ipcRenderer.on(ipcMessages.RenderUpdate, (event: any) => {
    screenRendererPure.update();
});
ipcRenderer.on(ipcMessages.CameraUpdate, (event: any, x: number, y: number, xScale: number, yScale: number) => {
    screenRendererPure.updateCamera(x, y, xScale, yScale);
});
screenRendererPure.reportCameraChange = (camera: Camera) => {
    ipcRenderer.send(ipcMessages.CameraChange, camera);
};

const gameUIPure = new GameUIPure();
gameUIPure.onPlayerMessageEntry = (message: string) => {
    ipcRenderer.send(ipcMessages.PlayerMessageEntry, message);
};
gameUIPure.onToolChange = (tool: ToolType) => {
    ipcRenderer.send(ipcMessages.ToolChange, tool);
};
gameUIPure.onScriptRun = (resourceID: string, args: string, entityID?: string) => {
    ipcRenderer.send(ipcMessages.RunScript, resourceID, args, entityID);
};
gameUIPure.onComponentDelete = (componentID: string) => {
    ipcRenderer.send(ipcMessages.DeleteComponent, componentID);
};

ipcRenderer.on(ipcMessages.SetupResourceIP, (event: any, ip: string) => {
    resourceAPIInterfacePure.setIP(ip);
});

const resourceAPIInterfacePure = new ResourceAPIInterfacePure();
resourceAPIInterfacePure.onTokenRequest = (tokenType: TokenType) => {
    ipcRenderer.send(ipcMessages.ResourceAPITokenRequest, tokenType);
};
// Manually hook up the UI manager to the file sender so we don't have to go through the process
// This avoids copying + reviving the file information which would be a massive pain
gameUIPure.onResourceUpload = (files: FileList, resourceID?: string) => {
    gameUIPure.beginFileUpload();
    resourceAPIInterfacePure.send(files, resourceID)
        .then(() => {
            gameUIPure.endFileUpload();
        });
};
gameUIPure.onResourceDelete = (resourceID: string) => {
    resourceAPIInterfacePure.delete(resourceID);
};
gameUIPure.onResourceInfoModify = (resourceID: string, property: string, value: string) => {
    ipcRenderer.send(ipcMessages.ResourceInfoModify, resourceID, property, value);
};
gameUIPure.onComponentEnableState = (componentID: string, state: boolean) => {
    ipcRenderer.send(ipcMessages.SetComponentEnableState, componentID, state);
};
gameUIPure.onEntityControl = (entity?: string) => {
    ipcRenderer.send(ipcMessages.SetEntityControl, entity);
};

ipcRenderer.on(ipcMessages.GameUIRender, (event: any) => {
    gameUIPure.render();
});
ipcRenderer.on(ipcMessages.ChatMessage, (event: any, message: string) => {
    gameUIPure.addChatMessage(message);
});
ipcRenderer.on(ipcMessages.ResourceAPIToken, (event: any, token: number, tokenType: TokenType) => {
    resourceAPIInterfacePure.supplyToken(token, tokenType);
});
ipcRenderer.on(ipcMessages.ResourceList, (event: any, resources: Resource[]) => {
    gameUIPure.setResourceList(resources);
});
ipcRenderer.on(ipcMessages.SetInspectEntity, (event: any, entityID: string | null) => {
    gameUIPure.inspect(undefinedIfNull<string>(entityID));
});
ipcRenderer.on(ipcMessages.UpdateEntityInspect, (
        event: any,
        components: ComponentInfo[],
        entityID: string,
        controlling: boolean) => {
    gameUIPure.setEntityData(components, entityID, controlling);
});

const loginUIPure = new LoginUIPure();
ipcRenderer.on(ipcMessages.LoginUIRender, (event: any) => {
    loginUIPure.render();
});
ipcRenderer.on(ipcMessages.LoginUIChangeMenu, (event: any, menu: string) => {
    loginUIPure.setMenu(menu);
});
loginUIPure.onConnect = (server: string) => {
    ipcRenderer.send(ipcMessages.Connect, server);
};
loginUIPure.onLogin = (username: string, password: string) => {
    ipcRenderer.send(ipcMessages.Login, username, password);
};
loginUIPure.onSignup = (username: string, email: string, password: string) => {
    ipcRenderer.send(ipcMessages.Signup, username, email, password);
};
