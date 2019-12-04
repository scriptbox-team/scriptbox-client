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
import WindowInputMock from "input/window-input-mock";
import ResourceAPIInterfaceMock from "networking/resource-api-interface-mock";
import ScreenRendererMock from "rendering/screen-renderer-mock";
import AudioPlayerMock from "sound/audio-player-mock";
import GameUIMock from "ui/game-ui-mock";
import LoginUIMock from "ui/login-ui-mock";
import UIManager from "ui/ui-manager";
import GameSoak from "core/game-soak";
import LoginAPIInterfaceMock from "networking/login-api-interface-mock";

const game = new GameSoak(
  new WindowInputMock(),
  new ScreenRendererMock(),
  new AudioPlayerMock(),
  new UIManager(new LoginUIMock(), new GameUIMock()),
  new ResourceAPIInterfaceMock(),
  new LoginAPIInterfaceMock()
);
game.start();
