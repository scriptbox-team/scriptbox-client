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
    constructor() {
        super();
        document.addEventListener("keydown", (ev) => {
            if (this.onKeyPressed !== undefined) {
                const time = Date.now();
                const type = InputType.Press;
                const code = ev.keyCode;
                const e = new KeyInputEvent(0, type, code, time);
                this.onKeyPressed(e);
            }
        });
        document.addEventListener("keyup", (ev) => {
            if (this.onKeyReleased !== undefined) {
                const time = Date.now();
                const type = InputType.Release;
                const code = ev.keyCode;
                const e = new KeyInputEvent(0, type, code, time);
                this.onKeyReleased(e);
            }
        });
    }
}
