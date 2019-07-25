import { InputEvent, InputType } from "./input-event";
import KeyInputEvent from "./key-input-event";
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

        document.addEventListener("keydown", (ev) => {
            const code = ev.keyCode;
            if (this.onKeyPressed !== undefined && !this._keysPressed.has(ev.keyCode)) {
                this._keysPressed.add(ev.keyCode);
                const time = Date.now();
                const type = InputType.Press;
                const e = new KeyInputEvent(0, type, code, time);
                this.onKeyPressed(e);
            }
        });
        document.addEventListener("keyup", (ev) => {
            const code = ev.keyCode;
            if (this.onKeyReleased !== undefined && this._keysPressed.has(ev.keyCode)) {
                this._keysPressed.delete(ev.keyCode);
                const time = Date.now();
                const type = InputType.Release;
                const e = new KeyInputEvent(0, type, code, time);
                this.onKeyReleased(e);
            }
        });
    }
}
