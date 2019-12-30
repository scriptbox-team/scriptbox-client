import { InputEvent, InputType } from "./input-event";

/**
 * A mouse input event, containing which button was used and the position.
 *
 * @export
 * @class MouseInputEvent
 * @extends {InputEvent}
 */
export default class MouseInputEvent extends InputEvent {
    public button: number;
    public x: number;
    public y: number;
    constructor(device: number, state: InputType, button: number, x: number, y: number) {
        super(device, state);
        this.button = button;
        this.x = x;
        this.y = y;
    }
}
