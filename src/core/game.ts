import {DebugLogType, log, setDebugLogTypes} from "core/debug-logger";
import GameLoop from "core/game-loop";
import InputHandler from "input/input-handler";
import KeyInputEvent from "input/key-input-event";
import WindowInput from "input/window-input";
import ClientNetEvent, { ClientEventType } from "networking/client-net-event";
import NetworkSystem from "networking/network-system";
import ClientChatMessagePacket from "networking/packets/client-chat-message-packet";
import ClientKeyboardInputPacket from "networking/packets/client-keyboard-input-packet";
import ServerChatMessagePacket from "networking/packets/server-chat-message-packet";
import ServerConnectionPacket from "networking/packets/server-connection-packet";
import ServerDisconnectionPacket from "networking/packets/server-disconnection-packet";
import ServerDisplayPacket from "networking/packets/server-display-packet";
import ScreenRenderer from "rendering/screen-renderer";
import UIManager from "ui/ui-manager";

/**
 * The base class of the game. Contains all of the systems necessary to run the game, and the game loop.
 *
 * @export
 * @class Game
 */
export default class Game {
    private _windowInput: WindowInput;
    private _screenRenderer: ScreenRenderer;
    private _inputHandler: InputHandler;
    private _uiManager: UIManager;
    private _networkSystem: NetworkSystem;
    private _gameLoop: GameLoop;
    /**
     * Creates an instance of Game.
     * This will take in different parameters depending on whether it's running through electron or browser.
     * @param {WindowInput} windowInput The type of WindowInput to use.
     * @memberof Game
     */
    constructor(windowInput: WindowInput, screenRenderer: ScreenRenderer, uiManager: UIManager) {
        setDebugLogTypes([]);
        this._windowInput = windowInput;
        this._screenRenderer = screenRenderer;
        this._inputHandler = new InputHandler();
        this._networkSystem = new NetworkSystem({address: "ws://localhost:7777"});
        this._uiManager = uiManager;
        this._windowInput.onKeyPressed = (event: KeyInputEvent) => {
            this._inputHandler.onKeyPress(event);
        };
        this._windowInput.onKeyReleased = (event: KeyInputEvent) => {
            this._inputHandler.onKeyRelease(event);
        };
        this._inputHandler.onKeyPress = (event: KeyInputEvent) => {
            log(DebugLogType.Input, "Sending key press: " + event.key);
            const packet = new ClientKeyboardInputPacket(event.key, event.state, event.device);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.Input, packet)
            );
        };
        this._inputHandler.onKeyRelease = (event: KeyInputEvent) => {
            log(DebugLogType.Input, "Sending key release: " + event.key);
            const packet = new ClientKeyboardInputPacket(event.key, event.state, event.device);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.Input, packet)
            );
        };
        this._networkSystem.netEventHandler.addConnectionDelegate((packet: ServerConnectionPacket) => {
            console.log("Connected to server.");
        });
        this._networkSystem.netEventHandler.addDisconnectionDelegate((packet: ServerDisconnectionPacket) => {
            console.log("Disconnected from server.");
        });
        this._networkSystem.netEventHandler.addChatMessageDelegate((packet: ServerChatMessagePacket) => {
            console.log("Received message: " + packet.message);
            this._uiManager.receiveChatMessage(packet.message);
        });
        this._networkSystem.netEventHandler.addDisplayDelegate((packet: ServerDisplayPacket) => {
            for (const renderObject of packet.displayPackage) {
                this._screenRenderer.updateRenderObject(
                    renderObject
                );
            }
        });
        this._uiManager.onPlayerMessageEntry = (message: string) => {
            console.log("You entered: " + message);
            const packet = new ClientChatMessagePacket(message);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.ChatMessage, packet)
            );
        };
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
        this._screenRenderer.update();
        this._uiManager.render();
        if (this._networkSystem.connected) {
            this._networkSystem.sendMessages();
        }
    }
}
