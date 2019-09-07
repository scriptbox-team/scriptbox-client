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
            const code = ev.keyCode;
            if (this.onKeyPressed !== undefined && !this._keysPressed.has(ev.keyCode)) {
                this._keysPressed.add(ev.keyCode);
                const type = InputType.Press;
                const e = new KeyInputEvent(0, type, code);
                this.onKeyPressed(e);
            }
        });
        screen.addEventListener("keyup", (ev) => {
            const code = ev.keyCode;
            if (this.onKeyReleased !== undefined && this._keysPressed.has(ev.keyCode)) {
                this._keysPressed.delete(ev.keyCode);
                const type = InputType.Release;
                const e = new KeyInputEvent(0, type, code);
                this.onKeyReleased(e);
            }
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
}
