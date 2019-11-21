import { InputEvent, InputType } from "./input-event";
import KeyInputEvent from "./key-input-event";
import MouseInputEvent from "./mouse-input-event";

/**
 * A class which performs callbacks when input is received.
 *
 * @export
 * @abstract
 * @class WindowInput
 */
export default abstract class WindowInput {
    public onKeyPressed?: (e: KeyInputEvent) => void;
    public onKeyReleased?: (e: KeyInputEvent) => void;
    public onMousePressed?: (e: MouseInputEvent) => void;
    public onMouseReleased?: (e: MouseInputEvent) => void;
    public onMouseMoved?: (e: MouseInputEvent) => void;
    public abstract queryGamepads(): void;
}
