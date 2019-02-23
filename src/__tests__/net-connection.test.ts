import NetConnection from "../net-connection";
import NetEvent, { NetEventType } from "../net-event";
import { Server, WebSocket } from "mock-socket";
const URL = "ws://localhost:7777";

let server: Server;
let messagePromise: Promise<string> | undefined;

let serverResolve = (data: string) => {};

const resetMessagePromise = () => {
    messagePromise = new Promise((resolve, reject) => {
        serverResolve = resolve;
    });
};

beforeAll(() => {
    server = new Server(URL);
    server.on("connection", (socket: any) => {
        socket.on("message", (data: any) => {
            serverResolve(data);
        });
    });
});

beforeEach(() => {
    resetMessagePromise();
});

test("NetConnection::connect - Base test", async () => {
    const nc = new NetConnection({address: URL});
    const expectStr = JSON.stringify(new NetEvent(NetEventType.Connect, {}));
    nc.connect();

    const message = await messagePromise;
    resetMessagePromise();

    expect(message).toEqual(expectStr);
});

test("NetConnection::send - Send chat message", async () => {
    const nc = new NetConnection({address: URL});
    const expectConnectStr = JSON.stringify(new NetEvent(NetEventType.Connect, {}));
    const expectMessageStr = JSON.stringify(new NetEvent(NetEventType.ChatMessage, {message: "Hello!!"}));
    nc.connect();

    let message = await messagePromise;
    expect(message).toEqual(expectConnectStr);
    resetMessagePromise();

    nc.send(new NetEvent(NetEventType.ChatMessage, {message: "Hello!!"}));

    message = await messagePromise;
    expect(message).toEqual(expectMessageStr);
});
