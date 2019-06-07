import Packet from "./packets/packet";
import ServerChatMessagePacket from "./packets/server-chat-message-packet";
import ServerConnectionPacket from "./packets/server-connection-packet";
import ServerDisconnectionPacket from "./packets/server-disconnection-packet";
import ServerNetEvent, { ServerEventType } from "./server-net-event";

/**
 * A class which takes in packet data, deserialies it and sends it to the necessary delegates.
 *
 * @export
 * @class NetEventHandler
 */
export default class NetEventHandler {
    private _connectionDelegates: Array<(packet: ServerConnectionPacket) => void>;
    private _disconnectionDelgates: Array<(packet: ServerDisconnectionPacket) => void>;
    private _messageDelegates: Array<(packet: ServerChatMessagePacket) => void>;
    /**
     * Creates an instance of NetEventHandler.
     * @memberof NetEventHandler
     */
    constructor() {
        this._connectionDelegates = new Array<(packet: ServerConnectionPacket) => void>();
        this._disconnectionDelgates = new Array<(packet: ServerDisconnectionPacket) => void>();
        this._messageDelegates = new Array<(packet: ServerChatMessagePacket) => void>();
    }
    /**
     * Add a delegate to respond to a connection packet
     *
     * @param {(packet: ServerConnectionPacket) => void} func The delegate to add
     * @memberof NetEventHandler
     */
    public addConnectionDelegate(func: (packet: ServerConnectionPacket) => void) {
        this._connectionDelegates.push(func);
    }
    /**
     * Add a delegate to respond to a disconnection packet
     *
     * @param {(packet: ServerDisconnectionPacket) => void} func The delegate to add
     * @memberof NetEventHandler
     */
    public addDisconnectionDelegate(func: (packet: ServerDisconnectionPacket) => void) {
        this._disconnectionDelgates.push(func);
    }
    /**
     * Add a delegate to respond to a chat message
     *
     * @param {(packet: ServerChatMessagePacket) => void} func The delegate to add
     * @memberof NetEventHandler
     */
    public addMessageDelegate(func: (packet: ServerChatMessagePacket) => void) {
        this._messageDelegates.push(func);
    }
    /**
     * Handle a ServerNetEvent, deserializing it and passing it to the necessary delegates.
     *
     * @param {ServerNetEvent} event The event to deserialize
     * @memberof NetEventHandler
     */
    public handle(event: ServerNetEvent) {
        switch (event.type) {
            case ServerEventType.Connection: {
                const data = ServerConnectionPacket.deserialize(event.data);
                if (data !== undefined) {
                    this.sendToDelegates(
                        data,
                        this._connectionDelegates
                    );
                }
                break;
            }
            case ServerEventType.Disconnection: {
                const data = ServerDisconnectionPacket.deserialize(event.data);
                if (data !== undefined) {
                    this.sendToDelegates(
                        data,
                        this._disconnectionDelgates
                    );
                }
                break;
            }
            case ServerEventType.ChatMessage: {
                const data = ServerChatMessagePacket.deserialize(event.data);
                if (data !== undefined) {
                    this.sendToDelegates(
                        data,
                        this._messageDelegates
                    );
                }
                break;
            }
        }
    }
    /**
     * Send a packet of a specific type to a set of delegates
     *
     * @private
     * @template T
     * @param {(T | undefined)} packet
     * @param {Array<(packet: T) => void>} delegates
     * @memberof NetEventHandler
     */
    private sendToDelegates<T extends Packet>(
        packet: T | undefined,
        delegates: Array<(packet: T) => void>,
    ) {
        if (packet !== undefined) {
            for (const f of delegates) {
                f(packet);
            }
        }
    }
}
