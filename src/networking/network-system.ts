import ClientNetEvent from "./client-net-event";
import NetConnection from "./net-connection";
import NetworkReceivingSubsystem from "./network-receiving-subsystem";
import NetworkSendingSubsystem from "./network-sending-subsystem";

/**
 * The constructor options for the network system.
 *
 * @interface NetworkSystemConstructorOptions
 */
interface NetworkSystemConstructorOptions {
    temp?: string;
}

/**
 * A system which handles sending and receiving messages to and from the server.
 *
 * @export
 * @class NetworkSystem
 */
export default class NetworkSystem {
    private _serverAddress: string;
    private _netConnection?: NetConnection;
    private _networkSendingSubsystem: NetworkSendingSubsystem;
    private _networkRecievingSubsystem: NetworkReceivingSubsystem;
    /**
     * Creates an instance of NetworkSystem.
     * This does not connect to the server.
     * @param {NetworkSystemConstructorOptions} options The constructor options.
     * @memberof NetworkSystem
     */
    constructor(options: NetworkSystemConstructorOptions = {}) {
        this._serverAddress = "";
        this._networkRecievingSubsystem = new NetworkReceivingSubsystem();
        this._networkSendingSubsystem = new NetworkSendingSubsystem();
    }
    /**
     * Connect to the server.
     *
     * @memberof NetworkSystem
     */
    public connect(address: string, userToken: string) {
        this._serverAddress = address;
        this._netConnection = new NetConnection({address: this._serverAddress});
        this._networkRecievingSubsystem.setNetConnection(this._netConnection);
        this._networkSendingSubsystem.setNetConnection(this._netConnection);
        this._netConnection.connect(userToken);
    }

    /**
     * Queue a message to send to the server.
     *
     * @param {ClientNetEvent} event
     * @memberof NetworkSystem
     */
    public queue(event: ClientNetEvent) {
        this._networkSendingSubsystem.queue(event);
    }

    /**
     * Send all queued messages to the server.
     *
     * @memberof NetworkSystem
     */
    public sendMessages() {
        this._networkSendingSubsystem.sendMessages();
    }

    /**
     * Get the NetEventHandler for this system.
     * This is where delegates go for reacting to server events.
     *
     * @readonly
     * @memberof NetworkSystem
     */
    get netEventHandler() {
        return this._networkRecievingSubsystem.netEventHandler;
    }

    /**
     * Get whether the network system is connected to a server or not
     *
     * @readonly
     * @memberof NetworkSystem
     */
    get connected() {
        return this._netConnection !== undefined && this._netConnection.connected;
    }
}
