import { InputEvent, InputType } from "./input-event";

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
