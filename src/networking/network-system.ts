import ClientNetEvent from "./client-net-event";
import NetConnection from "./net-connection";
import NetworkReceivingSubsystem from "./network-receiving-subsystem";
import NetworkSendingSubsystem from "./network-sending-subsystem";

/**
 * The constructor options for the network system.
 *
 * @interface INetworkSystemConstructorOptions
 */
interface INetworkSystemConstructorOptions {
    address: string;
}

/**
 * A system which handles sending and receiving messages to and from the server.
 *
 * @export
 * @class NetworkSystem
 */
export default class NetworkSystem {
    private _serverAddress: string;
    private _netConnection: NetConnection;
    private _networkSendingSubsystem: NetworkSendingSubsystem;
    private _networkRecievingSubsystem: NetworkReceivingSubsystem;
    /**
     * Creates an instance of NetworkSystem.
     * This does not connect to the server.
     * @param {INetworkSystemConstructorOptions} options The constructor options.
     * @memberof NetworkSystem
     */
    constructor(options: INetworkSystemConstructorOptions) {
        this._serverAddress = options.address;
        this._netConnection = new NetConnection({address: this._serverAddress});
        this._networkRecievingSubsystem = new NetworkReceivingSubsystem(this._netConnection);
        this._networkSendingSubsystem = new NetworkSendingSubsystem(this._netConnection);
    }
    /**
     * Connect to the server.
     *
     * @memberof NetworkSystem
     */
    public connect() {
        this._netConnection.connect();
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
        return this._netConnection.connected;
    }
}
