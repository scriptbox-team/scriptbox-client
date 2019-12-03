/* tslint:disable */
import "module-alias/register";
import ModuleAlias from "module-alias";
import * as path from "path";

ModuleAlias.addAliases({
  core: path.join(__dirname, "core"),
  input: path.join(__dirname, "input"),
  ipc: path.join(__dirname, "ipc"),
  networking: path.join(__dirname, "networking"),
  rendering: path.join(__dirname, "rendering"),
  ui: path.join(__dirname, "ui"),
  sound: path.join(__dirname, "sound"),
  "resource-management": path.join(__dirname, "resource-management")
});

import "source-map-support/register";
import Game from "core/game";
import { app, BrowserWindow } from "electron";
import WindowInputProxy from "input/window-input-proxy";
import ScreenRendererProxy from "rendering/screen-renderer-proxy";
import GameUIProxy from "ui/game-ui-proxy";
import ResourceAPIInterfaceProxy from "networking/resource-api-interface-proxy";
import UIManager from "ui/ui-manager";
import LoginUIProxy from "ui/login-ui-proxy";
import AudioPlayerProxy from "sound/audio-player-proxy";
import LoginAPIInterfaceProxy from "networking/login-api-interface-proxy";
/* tslint:enable */

let mainWindow: Electron.BrowserWindow | null;

let game: Game;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: false
  });

  game = new Game(
    new WindowInputProxy(mainWindow.webContents),
    new ScreenRendererProxy(mainWindow.webContents),
    new AudioPlayerProxy(mainWindow.webContents),
    new UIManager(new LoginUIProxy(mainWindow.webContents), new GameUIProxy(mainWindow.webContents)),
    new ResourceAPIInterfaceProxy(mainWindow.webContents),
    new LoginAPIInterfaceProxy(mainWindow.webContents)
  );

  mainWindow.on("ready-to-show", () => {
    if (mainWindow !== null) {
      mainWindow.show();
      game.start();
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
