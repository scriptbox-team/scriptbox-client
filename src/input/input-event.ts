/**
 * The type of an input.
 * Press and Release are for buttons, and move is for axes.
 *
 * @export
 * @enum {number}
 */
export enum InputType {
    Press = 0,
    Release = 1,
    Move = 2
}

/**
 * The type of device an input came from
 *
 * @export
 * @enum {number}
 */
export enum DeviceType {
    Keyboard = 0,
    Mouse = 1,
    Controller = 2
}

/**
 * A single input event.
 * This contains an input time and a state.
 *
 * @export
 * @class InputEvent
 */
export class InputEvent {
    /**
     * The device used to make the input.
     *
     * @type {number}
     * @memberof InputEvent
     */
    public device: DeviceType;
    /**
     * The state change performed by the input
     *
     * @type {InputType}
     * @memberof InputEvent
     */
    public state: InputType;
    constructor(device: DeviceType, state: InputType) {
        this.device = device;
        this.state = state;
    }
}
