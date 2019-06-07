import KeyInputEvent from "./key-input-event";

/**
 * A class which takes inputs and performs callbacks based on the kind of input
 *
 * @export
 * @class InputHandler
 */
export default class InputHandler {
    private _onRelease: ((e: KeyInputEvent) => void) | undefined;
    private _onPress: ((e: KeyInputEvent) => void) | undefined;
    /**
     * Take an input press event and pass it to the appropriate callback
     *
     * @param {KeyInputEvent} event The event to pass
     * @memberof InputHandler
     */
    public onKeyPress(event: KeyInputEvent) {
        this._onPress!(event);
    }
    /**
     * Take an input release event and pass it to the appropriate callback
     *
     * @param {KeyInputEvent} event The event to pass
     * @memberof InputHandler
     */
    public onKeyRelease(event: KeyInputEvent) {
        this._onRelease!(event);
    }
    /**
     * Set up a callback to react to key press events.
     *
     * @param {(e: KeyInputEvent) => void} callback The callback to perform on a key press
     * @memberof InputHandler
     */
    public setOnPress(callback: (e: KeyInputEvent) => void) {
        this._onPress = callback;
    }
    /**
     * Set up a callback to react to key release events.
     *
     * @param {(e: KeyInputEvent) => void} callback The callback to perform on a key release
     * @memberof InputHandler
     */
    public setOnRelease(callback: (e: KeyInputEvent) => void) {
        this._onRelease = callback;
    }
}
