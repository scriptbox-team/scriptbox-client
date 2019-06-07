import ClientNetEvent from "./client-net-event";

/**
 * Queues client messages to send to the server and sends them to a callback on the next tick.
 *
 * @export
 * @class MessageHandler
 */
export default class MessageHandler {
    private _queue: ClientNetEvent[];
    private _onSend?: (event: ClientNetEvent) => void;
    /**
     * Creates an instance of MessageHandler.
     * @memberof MessageHandler
     */
    constructor() {
        this._queue = [];
    }
    /**
     * Queues a message to be sent next tick.
     *
     * @param {ClientNetEvent} event
     * @memberof MessageHandler
     */
    public addToQueue(event: ClientNetEvent) {
        this._queue.push(event);
    }
    /**
     * Sets up the callback to send messages to
     *
     * @param {(event: ClientNetEvent) => void} onSend
     * @memberof MessageHandler
     */
    public onSend(onSend: (event: ClientNetEvent) => void) {
        this._onSend = onSend;
    }
    /**
     * Send all queued messages to the defined callback.
     *
     * @memberof MessageHandler
     */
    public send() {
        for (const m of this._queue) {
            this._onSend!(m);
        }
        this._queue = [];
    }
}
