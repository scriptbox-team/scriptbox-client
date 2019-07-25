import {InputEvent, InputType} from "./input-event";

/**
 * A kind of input event that specifically deals with keyboard inputs.
 *
 * @export
 * @class KeyInputEvent
 * @extends {InputEvent}
 */
export default class KeyInputEvent extends InputEvent {
    public key: number;
    constructor(device: number, state: InputType, key: number, time: number) {
        super(device, state, time);
        this.key = key;
    }
}
