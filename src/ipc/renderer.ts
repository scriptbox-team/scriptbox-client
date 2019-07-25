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
    rendering: path.join(__dirname, "..", "rendering")
  });

import "source-map-support/register";

import { ipcRenderer } from "electron";
import WindowInput from "input/window-input-pure";
import RenderObject from "rendering/render-object";
import ScreenRendererPure from "rendering/screen-renderer-pure";
import ipcMessages from "./ipc-messages";
/* tslint:enable */

const windowInputPure = new WindowInput();

windowInputPure.onKeyPressed = (event) => {
    ipcRenderer.send(ipcMessages.KeyPress, event);
};

windowInputPure.onKeyReleased = (event) => {
    ipcRenderer.send(ipcMessages.KeyRelease, event);
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
