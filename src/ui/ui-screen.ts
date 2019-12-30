/**
 * A single UI screen.
 * These screens are switched between by the UI Manager.
 *
 * @export
 * @abstract
 * @class UIScreen
 */
export default abstract class UIScreen {
    /**
     * Render the UI screen.
     *
     * @abstract
     * @memberof UIScreen
     */
    public abstract render(): void;
}
