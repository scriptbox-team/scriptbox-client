import ClientNetEvent from "./client-net-event";
import MessageHandler from "./message-handler";
import NetConnection from "./net-connection";

/**
 * A subsystem of the Network system concerned with queueing and sending packets.
 *
 * @export
 * @class NetworkSendingSubsystem
 */
export default class NetworkSendingSubsystem {
    private _messageHandler: MessageHandler;
    private _netConnection: NetConnection;
    /**
     * Creates an instance of NetworkSendingSubsystem.
     * @param {NetConnection} netConnection
     * @memberof NetworkSendingSubsystem
     */
    constructor(netConnection: NetConnection) {
        this._netConnection = netConnection;
        this._messageHandler = new MessageHandler();
        this._messageHandler.onSend((event: ClientNetEvent) => {
            if (this._netConnection.connected) {
                this._netConnection.send(event);
            }
        });
    }
    /**
     * Queue an event to send to the server.
     *
     * @param {ClientNetEvent} event
     * @memberof NetworkSendingSubsystem
     */
    public queue(event: ClientNetEvent) {
        this._messageHandler.addToQueue(event);
    }
    /**
     * Send all queued events to the server.
     *
     * @memberof NetworkSendingSubsystem
     */
    public sendMessages() {
        this._messageHandler.send();
    }
}
