import Game from "core/game";
import WindowInputPure from "input/window-input-pure";
import ScreenRendererPure from "rendering/screen-renderer-pure";

const game = new Game(new WindowInputPure(), new ScreenRendererPure(1920, 1080));
game.start();
