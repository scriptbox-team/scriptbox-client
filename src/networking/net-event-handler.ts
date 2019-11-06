import Packet from "./packets/packet";
import ServerCameraUpdatePacket from "./packets/server-camera-update-packet";
import ServerChatMessagePacket from "./packets/server-chat-message-packet";
import ServerConnectionPacket from "./packets/server-connection-packet";
import ServerDisconnectionPacket from "./packets/server-disconnection-packet";
import ServerDisplayPacket from "./packets/server-display-packet";
import ServerEntityInspectionListingPacket from "./packets/server-entity-inspection-listing-packet";
import ServerResourceListingPacket from "./packets/server-resource-listing-packet";
import ServerSoundPacket from "./packets/server-sound-packet";
import ServerTokenPacket from "./packets/server-token-packet";
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
    private _displayDelegates: Array<(packet: ServerDisplayPacket) => void>;
    private _tokenDelegates: Array<(packet: ServerTokenPacket) => void>;
    private _resourceListingDelegates: Array<(packet: ServerResourceListingPacket) => void>;
    private _entityInspectListingDelegates: Array<(packet: ServerEntityInspectionListingPacket) => void>;
    private _soundPlayDelegates: Array<(packet: ServerSoundPacket) => void>;
    private _cameraUpdateDelegates: Array<(packet: ServerCameraUpdatePacket) => void>;
    /**
     * Creates an instance of NetEventHandler.
     * @memberof NetEventHandler
     */
    constructor() {
        this._connectionDelegates = new Array<(packet: ServerConnectionPacket) => void>();
        this._disconnectionDelgates = new Array<(packet: ServerDisconnectionPacket) => void>();
        this._messageDelegates = new Array<(packet: ServerChatMessagePacket) => void>();
        this._displayDelegates = new Array<(packet: ServerDisplayPacket) => void>();
        this._tokenDelegates = new Array<(packet: ServerTokenPacket) => void>();
        this._resourceListingDelegates = new Array<(packet: ServerResourceListingPacket) => void>();
        this._entityInspectListingDelegates = new Array<(packet: ServerEntityInspectionListingPacket) => void>();
        this._soundPlayDelegates = new Array<(packet: ServerSoundPacket) => void>();
        this._cameraUpdateDelegates = new Array<(packet: ServerCameraUpdatePacket) => void>();
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
    public addChatMessageDelegate(func: (packet: ServerChatMessagePacket) => void) {
        this._messageDelegates.push(func);
    }

    public addDisplayDelegate(func: (packet: ServerDisplayPacket) => void) {
        this._displayDelegates.push(func);
    }

    public addTokenDelegate(func: (packet: ServerTokenPacket) => void) {
        this._tokenDelegates.push(func);
    }

    public addResourceListingDelegate(func: (packet: ServerResourceListingPacket) => void) {
        this._resourceListingDelegates.push(func);
    }

    public addEntityInspectListingDelegate(func: (packet: ServerEntityInspectionListingPacket) => void) {
        this._entityInspectListingDelegates.push(func);
    }

    public addSoundPlayDelegate(func: (packet: ServerSoundPacket) => void) {
        this._soundPlayDelegates.push(func);
    }

    public addCameraUpdateDelegate(func: (packet: ServerCameraUpdatePacket) => void) {
        this._cameraUpdateDelegates.push(func);
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
                    this._sendToDelegates(
                        data,
                        this._connectionDelegates
                    );
                }
                break;
            }
            case ServerEventType.Disconnection: {
                const data = ServerDisconnectionPacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._disconnectionDelgates
                    );
                }
                break;
            }
            case ServerEventType.ChatMessage: {
                const data = ServerChatMessagePacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._messageDelegates
                    );
                }
                break;
            }
            case ServerEventType.DisplayPackage: {
                const data = ServerDisplayPacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._displayDelegates
                    );
                }
                break;
            }
            case ServerEventType.Token: {
                const data = ServerTokenPacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._tokenDelegates
                    );
                }
                break;
            }
            case ServerEventType.ResourceListing: {
                const data = ServerResourceListingPacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._resourceListingDelegates
                    );
                }
                break;
            }
            case ServerEventType.EntityInspectListing: {
                const data = ServerEntityInspectionListingPacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._entityInspectListingDelegates
                    );
                }
                break;
            }
            case ServerEventType.SoundPlay: {
                const data = ServerSoundPacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._soundPlayDelegates
                    );
                }
                break;
            }
            case ServerEventType.CameraInfo: {
                const data = ServerCameraUpdatePacket.deserialize(event.data);
                if (data !== undefined) {
                    this._sendToDelegates(
                        data,
                        this._cameraUpdateDelegates
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
    private _sendToDelegates<T extends Packet>(
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
