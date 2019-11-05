import WebSocket from "isomorphic-ws";

import ClientNetEvent, { ClientEventType } from "./client-net-event";
import ClientConnectionInfoPacket from "./packets/client-connection-info-packet";
import ServerNetEvent, { ServerEventType } from "./server-net-event";

/**
 * An interface defining data from a websocket message
 *
 * @interface WebSocketMessage
 */
interface WebSocketMessage {
    data: WebSocket.Data;
    type: string;
    target: WebSocket;
}

/**
 * an interface defining data from a websocket close event
 *
 * @interface WebSocketClose
 */
interface WebSocketClose {
    wasClean: boolean;
    code: number;
    reason: string;
    target: WebSocket;
}

/**
 * An enum of close codes
 *
 * @enum {number}
 */
const enum CloseCodes {
    Normal = 1000
}

/**
 * @interface NetSendConstructionOptions
 */
interface NetConnectionConstructorOptions {
    address: string;
}

/**
 * A class which handles communications with the server.
 *
 * @export
 * @class NetSend
 */
export default class NetConnection {
    /**
     * @type {string}
     * @memberof NetConnection
     */
    public address: string;
    public connected: boolean;
    private _onMessage?: (e: ServerNetEvent) => void;
    private _onConnect?: (e: ServerNetEvent) => void;
    private _onDisconnect?: (e: ServerNetEvent) => void;
    private socket?: WebSocket;

    /**
     * Creates the NetSend object.
     * This configures the NetSend with the settings to connect to the server
     *
     * @param {NetConnectionConstructorOptions} options
     * @memberof NetSend
     */
    constructor(options: NetConnectionConstructorOptions) {
        this.address = `ws://${options.address}`;
        this.connected = false;
    }

    /**
     * Connects to a server
     *
     * @param {string} address The address to connect to
     * @memberof NetConnection
     */
    public async connect(userToken: string) {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(this.address);
                this.socket.onopen = () => {
                    const defaultResponse = (event: WebSocketMessage) => {
                        const dataObj = ServerNetEvent.deserialize(event.data);
                        if (dataObj !== undefined) {
                            switch (dataObj.type) {
                                case ServerEventType.ConnectionInfoRequest: {
                                    const ev = new ClientNetEvent(
                                        ClientEventType.ConnectionInfo,
                                        new ClientConnectionInfoPacket(userToken)
                                    );
                                    this.socket!.send(ev.serialize());
                                }
                                case ServerEventType.ConnectionAcknowledgement: {
                                    this.connected = true;
                                    this.socket!.onmessage = (e: WebSocketMessage) => {
                                        const dObj = ServerNetEvent.deserialize(e.data);
                                        if (dObj !== undefined) {
                                            this._onMessage!(dObj);
                                        }
                                    };
                                    this.socket!.onclose = (e: WebSocketClose) => {
                                        const ev = new ServerNetEvent(ServerEventType.Disconnection, {code: e.code});
                                        this._onDisconnect!(ev);
                                    };
                                    this._onConnect!(new ServerNetEvent(ServerEventType.Connection, event.data));
                                    resolve();
                                }
                            }
                        }
                    };
                    this.socket!.onmessage = defaultResponse;
                };
            }
            catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Disconnect from the current connection.
     */
    public async disconnect() {
        return new Promise((resolve, reject) => {
            try {
                const defaultResponse = (event: WebSocketMessage) => {
                    const dataObj = ServerNetEvent.deserialize(event.data);
                    if (dataObj !== undefined) {
                        if (dataObj.type === ServerEventType.Disconnection) {
                            this.socket!.close(CloseCodes.Normal);
                            this.socket!.onmessage = () => {};
                        }
                    }
                };
                this.socket!.onclose = () => {
                    resolve();
                };
                this.socket!.onmessage = defaultResponse;
                this.send(new ClientNetEvent(ClientEventType.DisconnectionRequest, {}));
            }
            catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Send a message to the server
     *
     * @param {NetEvent} event The event to send to the server
     * @memberof NetConnection
     */
    public send(event: ClientNetEvent) {
        try {
            this.socket!.send(event.serialize());
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Set up a callback to perform when a message is received
     *
     * @param {(e: ServerNetEvent) => void} callback The callback to perform when the message is received
     * @memberof NetConnection
     */
    public onMessage(callback: (e: ServerNetEvent) => void) {
        this._onMessage = callback;
    }

    /**
     * Set up a callback to perform when connected to the server
     *
     * @param {(e: ServerNetEvent) => void} callback The callback to perform when connected
     * @memberof NetConnection
     */
    public onConnect(callback: (e: ServerNetEvent) => void) {
        this._onConnect = callback;
    }

    /**
     * Set up a callback to perform when disconnected from the server.
     *
     * @param {(e: ServerNetEvent) => void} callback The callback to perform when disconnected.
     * @memberof NetConnection
     */
    public onDisconnect(callback: (e: ServerNetEvent) => void) {
        this._onDisconnect = callback;
    }
}
