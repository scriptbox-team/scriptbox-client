/*
 * This file is used to facilitate IPC communication for the electron version.
 * This passes things from the pure versions to the proxies and vice-versa.
 */
import { ipcRenderer } from "electron";
import WindowInput from "input/window-input-pure";
import ipcMessages from "./ipc-messages";

const windowInputPure = new WindowInput();
windowInputPure.onKeyPressed = (event) => {
    ipcRenderer.send(ipcMessages.KeyPress, event);
};

windowInputPure.onKeyReleased = (event) => {
    ipcRenderer.send(ipcMessages.KeyRelease, event);
};
