import GameLoop from "core/game-loop";
import InputHandler from "input/input-handler";
import KeyInputEvent from "input/key-input-event";
import WindowInput from "input/window-input";
import ClientNetEvent, { ClientEventType } from "networking/client-net-event";
import NetworkSystem from "networking/network-system";
import ServerChatMessagePacket from "networking/packets/server-chat-message-packet";
import ServerConnectionPacket from "networking/packets/server-connection-packet";
import ServerDisconnectionPacket from "networking/packets/server-disconnection-packet";

/**
 * The base class of the game. Contains all of the systems necessary to run the game, and the game loop.
 *
 * @export
 * @class Game
 */
export default class Game {
    private _windowInput: WindowInput;
    private _inputHandler: InputHandler;
    private _networkSystem: NetworkSystem;
    private _gameLoop: GameLoop;
    /**
     * Creates an instance of Game.
     * This will take in different parameters depending on whether it's running through electron or browser.
     * @param {WindowInput} windowInput The type of WindowInput to use.
     * @memberof Game
     */
    constructor(windowInput: WindowInput) {
        this._windowInput = windowInput;
        this._inputHandler = new InputHandler();
        this._networkSystem = new NetworkSystem({address: "ws://localhost:7777"});
        this._windowInput.onKeyPressed = (event: KeyInputEvent) => {
            this._inputHandler.onKeyPress(event);
        };
        this._windowInput.onKeyReleased = (event: KeyInputEvent) => {
            this._inputHandler.onKeyRelease(event);
        };
        this._inputHandler.onKeyPress = (event: KeyInputEvent) => {
            console.log("Sending keypress " + event.key);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.Input, event)
            );
        };
        this._inputHandler.onKeyRelease = (event: KeyInputEvent) => {
        };
        this._networkSystem.netEventHandler.addConnectionDelegate((packet: ServerConnectionPacket) => {
            console.log("Connected to server.");
        });
        this._networkSystem.netEventHandler.addDisconnectionDelegate((packet: ServerDisconnectionPacket) => {
            console.log("Disconnected from server.");
        });
        this._networkSystem.netEventHandler.addMessageDelegate((packet: ServerChatMessagePacket) => {
            console.log("MSG: " + packet.message);
        });
        this._gameLoop = new GameLoop(this.tick.bind(this), 60);
    }

    /**
     * Start the game.
     *
     * @memberof Game
     */
    public start() {
        // Connecting on startup is temporary until there are menus.
        this._networkSystem.connect();
        this._gameLoop.start();
    }

    /**
     * Perform one game tick.
     *
     * @private
     * @memberof Game
     */
    private tick() {
        this._networkSystem.sendMessages();
    }
}
