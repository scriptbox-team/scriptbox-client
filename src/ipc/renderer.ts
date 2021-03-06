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
    sound: path.join(__dirname, "..", "sound"),
    "resource-management": path.join(__dirname, "..", "resource-management")
  });

import "source-map-support/register";

import {setDebugLogTypes, DebugLogType} from "core/debug-logger";
import { ipcRenderer } from "electron";
import { ToolType } from "input/tool-type";
import WindowInputPure from "input/window-input-pure";
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
import AudioPlayerPure from "sound/audio-player-pure";
import AudioObject from "resource-management/audio-object";
import LoginAPIInterfacePure from "networking/login-api-interface-pure";
/* tslint:enable */

const windowInputPure = new WindowInputPure();

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
ipcRenderer.on(ipcMessages.QueryGamepads, (event: any) => {
    windowInputPure.queryGamepads();
});

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

const audioPlayerPure = new AudioPlayerPure();

ipcRenderer.on(ipcMessages.PlaySound, (event: any, resourceIP: string, sound: AudioObject) => {
    audioPlayerPure.play(resourceIP, sound);
});
ipcRenderer.on(ipcMessages.StopSound, (event: any, soundID?: string) => {
    audioPlayerPure.stop(soundID);
});
ipcRenderer.on(ipcMessages.ResumeSound, (event: any, soundID: string) => {
    audioPlayerPure.resume(soundID);
});
ipcRenderer.on(ipcMessages.PauseSound, (event: any, soundID: string) => {
    audioPlayerPure.pause(soundID);
});

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
gameUIPure.onCloneResource = (resourceID: string) => {
    ipcRenderer.send(ipcMessages.CloneResource, resourceID);
};
gameUIPure.onSearchResourceRepo = (search: string) => {
    ipcRenderer.send(ipcMessages.SearchResourceRepo, search);
};
gameUIPure.onRequestEditScript = (scriptID: string) => {
    ipcRenderer.send(ipcMessages.RequestEditScript, scriptID);
};
gameUIPure.onEditScript = (scriptID: string, script: string) => {
    ipcRenderer.send(ipcMessages.EditScript, scriptID, script);
};
gameUIPure.onModifyComponentMeta = (componentID: string, option: string, value: string) => {
    ipcRenderer.send(ipcMessages.ModifyComponentMeta, componentID, option, value);
};

ipcRenderer.on(ipcMessages.SetupResourceIP, (event: any, ip: string) => {
    resourceAPIInterfacePure.setIP(ip);
});

const resourceAPIInterfacePure = new ResourceAPIInterfacePure();
resourceAPIInterfacePure.onTokenRequest = (tokenType: TokenType) => {
    ipcRenderer.send(ipcMessages.ResourceAPITokenRequest, tokenType);
};

const loginAPIInterfacePure = new LoginAPIInterfacePure();

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
gameUIPure.onMakePrefab = (entityID: string) => {
    ipcRenderer.send(ipcMessages.CreatePrefab, entityID);
};
gameUIPure.onResourceSelect = (resourceID: string | undefined) => {
    ipcRenderer.send(ipcMessages.ResourceSelect, resourceID);
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
ipcRenderer.on(ipcMessages.ResourceRepoList, (event: any, list: Resource[], search: string) => {
    gameUIPure.setResourceRepoList(list, search);
});
ipcRenderer.on(ipcMessages.ScriptText, (event: any, scriptID: string, script: string) => {
    gameUIPure.setEditingScriptText(scriptID, script);
});

const loginUIPure = new LoginUIPure();
ipcRenderer.on(ipcMessages.LoginUIRender, (event: any) => {
    loginUIPure.render();
});
ipcRenderer.on(ipcMessages.LoginUIChangeMenu, (event: any, menu: string) => {
    loginUIPure.setMenu(menu);
});
ipcRenderer.on(ipcMessages.SetLoginStatus, (event: any, status: string) => {
    loginUIPure.setStatus(status);
});
loginUIPure.onConnect = (server: string) => {
    ipcRenderer.send(ipcMessages.Connect, server);
};
loginUIPure.onLoginAttempt = (username: string, password: string) => {
    loginAPIInterfacePure.login(username, password)
        .then((res) => {
            loginUIPure.login(username, res);
        })
        .catch((err) => {
            loginUIPure.setStatus(err);
        });
};
loginUIPure.onLogin = (username: string, token: string) => {
    ipcRenderer.send(ipcMessages.Login, username, token);
};

loginUIPure.onSignup = (username: string, email: string, password: string) => {
    loginAPIInterfacePure.signup(username, email, password)
        .then((res) => {
            loginUIPure.setStatus(res);
        })
        .catch((err) => {
            loginUIPure.setStatus(err);
        });
};

ipcRenderer.on(ipcMessages.SetupLoginURL, (event: any, url: string) => {
    loginAPIInterfacePure.setURL(url);
});
