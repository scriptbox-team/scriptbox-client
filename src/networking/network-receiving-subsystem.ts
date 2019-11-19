import NetConnection from "./net-connection";
import NetEventHandler from "./net-event-handler";
import ServerNetEvent, { ServerEventType } from "./server-net-event";

/**
 * A subsystem of the Network system concerned with receiving events from the server.
 *
 * @export
 * @class NetworkReceivingSubsystem
 */
export default class NetworkReceivingSubsystem {
    public netEventHandler: NetEventHandler;
    private _netConnection?: NetConnection;
    constructor() {
        this.netEventHandler = new NetEventHandler();
    }
    public setNetConnection(netConnection: NetConnection) {
        this._netConnection = netConnection;
        this._netConnection.onConnect((e: ServerNetEvent) => {
            this.netEventHandler.handle(e);
        });
        this._netConnection.onDisconnect((e: ServerNetEvent) => {
            this.netEventHandler.handle(e);
        });
        this._netConnection.onMessage((e: ServerNetEvent) => {
            this.netEventHandler.handle(e);
        });
    }
}
