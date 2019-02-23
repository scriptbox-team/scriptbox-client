export enum NetEventType {
    Connect,
    Disconnect,
    ChatMessage
}

export default class NetEvent {
    public type: NetEventType;
    public data: object;
    constructor(type: NetEventType, data: object) {
        this.type = type;
        this.data = data;
    }
}
