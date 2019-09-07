import Game from "core/game";
import WindowInputPure from "input/window-input-pure";
import ResourceAPIInterfacePure from "networking/resource-api-interface-pure";
import ScreenRendererPure from "rendering/screen-renderer-pure";
import UIManagerPure from "ui/ui-manager-pure";

// Note: We don't need to set up anything with paths in here
// Because the browser version uses webpack

const game = new Game(
    new WindowInputPure(),
    new ScreenRendererPure(1920, 1080),
    new UIManagerPure(),
    new ResourceAPIInterfacePure()
);
game.start();
