import { InputType } from "./input-event";
import KeyInputEvent from "./key-input-event";
import MouseInputEvent from "./mouse-input-event";
import WindowInput from "./window-input";

/**
 * A pure browser-side method of retrieving input.
 * This is used both electron-side and browser-side.
 *
 * @export
 * @class WindowInputPure
 * @extends {WindowInput}
 */
export default class WindowInputPure extends WindowInput {
    private _keysPressed: Set<number>;
    constructor() {
        super();
        this._keysPressed = new Set<number>();
        const screen = document.getElementById("screen")!;

        screen.addEventListener("keydown", (ev) => {
            this._handlePress(ev.keyCode);
        });
        screen.addEventListener("keyup", (ev) => {
            this._handleRelease(ev.keyCode);
        });
        screen.addEventListener("mousedown", (ev) => {
            const button = ev.button;
            if (this.onMousePressed !== undefined) {
                const type = InputType.Press;
                const x = ev.x;
                const y = ev.y;
                const e = new MouseInputEvent(0, type, button, x, y);
                this.onMousePressed(e);
            }
        });
        screen.addEventListener("mouseup", (ev) => {
            const button = ev.button;
            if (this.onMouseReleased !== undefined) {
                const type = InputType.Press;
                const x = ev.x;
                const y = ev.y;
                const e = new MouseInputEvent(0, type, button, x, y);
                this.onMouseReleased(e);
            }
        });
        screen.addEventListener("mousemove", (ev) => {
            if (this.onMouseMoved !== undefined) {
                const type = InputType.Move;
                const x = ev.x;
                const y = ev.y;
                const e = new MouseInputEvent(0, type, -1, x, y);
                this.onMouseMoved(e);
            }
        });
    }
    public queryGamepads() {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad !== null) {
                const lr = gamepad.axes[0];
                const ud = gamepad.axes[1];
                const deadZone = 0.5;
                if (lr < -deadZone) {
                    this._handlePress(37);
                    this._handleRelease(39);
                }
                else if (lr > deadZone) {
                    this._handlePress(39);
                    this._handleRelease(37);
                }
                else {
                    this._handleRelease(37);
                    this._handleRelease(39);
                }
                if (ud < -deadZone) {
                    this._handlePress(38);
                    this._handleRelease(40);
                }
                else if (ud > deadZone) {
                    this._handlePress(40);
                    this._handleRelease(38);
                }
                else {
                    this._handleRelease(38);
                    this._handleRelease(40);
                }
                if (gamepad.buttons[0].pressed) {
                    this._handlePress(90);
                }
                else {
                    this._handleRelease(90);
                }
            }
        }
    }
    private _handlePress(keyCode: number) {
        if (this.onKeyPressed !== undefined && !this._keysPressed.has(keyCode)) {
            this._keysPressed.add(keyCode);
            const type = InputType.Press;
            const e = new KeyInputEvent(0, type, keyCode);
            this.onKeyPressed(e);
        }
    }
    private _handleRelease(keyCode: number) {
            if (this.onKeyReleased !== undefined && this._keysPressed.has(keyCode)) {
                this._keysPressed.delete(keyCode);
                const type = InputType.Release;
                const e = new KeyInputEvent(0, type, keyCode);
                this.onKeyReleased(e);
            }
    }
}
