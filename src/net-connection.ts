import NetEvent, {NetEventType} from "./net-event";

const enum CloseCodes {
    Normal = 1000
}

/**
 * @interface INetSendConstructionOptions
 */
interface INetConnectionConstructorOptions {
    address: string;
}

/**
 * @export
 * @class NetSend
 */
export default class NetConnection {
    /**
     * @type {string}
     * @memberof NetConnection
     */
    public address: string;
    private socket?: WebSocket;

    /**
     * Creates the NetSend object.
     * This configures the NetSend with the settings to connect to the server
     *
     * @param {INetConnectionConstructorOptions} options
     * @memberof NetSend
     */
    constructor(options: INetConnectionConstructorOptions) {
        this.address = options.address;
    }

    /**
     * Connects to a server
     *
     * @param {string} address The address to connect to
     * @memberof NetConnection
     */
    public connect() {
        try {
            this.socket = new WebSocket(this.address);
            this.send(new NetEvent(NetEventType.Connect, {}));
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Disconnect from the current connection.
     */
    public disconnect() {
        try {
            this.send(new NetEvent(NetEventType.Disconnect, {}));
            this.socket!.close(CloseCodes.Normal);
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Send a message to the server
     *
     * @param {NetEvent} event The event to send to the server
     * @memberof NetConnection
     */
    public send(event: NetEvent) {
        this.socket!.send(JSON.stringify(event));
    }
}
