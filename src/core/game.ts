import { DebugLogType, log, setDebugLogTypes } from "core/debug-logger";
import GameLoop from "core/game-loop";
import InputHandler from "input/input-handler";
import KeyInputEvent from "input/key-input-event";
import MouseInputEvent from "input/mouse-input-event";
import { ToolType } from "input/tool-type";
import WindowInput from "input/window-input";
import ClientNetEvent, { ClientEventType } from "networking/client-net-event";
import LoginAPIInterface from "networking/login-api-interface";
import NetworkSystem from "networking/network-system";
import ClientChatMessagePacket from "networking/packets/client-chat-message-packet";
import ClientCloneResourcePacket from "networking/packets/client-clone-resource-packet";
import ClientEditScriptPacket from "networking/packets/client-edit-script-packet";
import ClientEntityCreationPacket from "networking/packets/client-entity-creation-packet";
import ClientEntityDeletionPacket from "networking/packets/client-entity-deletion-packet";
import ClientEntityInspectionPacket from "networking/packets/client-entity-inspection-packet";
import ClientExecuteScriptPacket from "networking/packets/client-execute-script-packet";
import ClientKeyboardInputPacket from "networking/packets/client-keyboard-input-packet";
import ClientModifyComponentMetaPacket from "networking/packets/client-modify-component-meta-packet";
import ClientModifyMetadataPacket from "networking/packets/client-modify-metadata-packet";
import ClientPrefabCreationPacket from "networking/packets/client-prefab-creation-packet";
import ClientRemoveComponentPacket from "networking/packets/client-remove-component-packet";
import ClientRequestEditScriptPacket from "networking/packets/client-request-edit-script-packet";
import ClientSearchResourceRepoPacket from "networking/packets/client-search-resource-repo-packet";
import ClientSetComponentEnableStatePacket from "networking/packets/client-set-component-enable-state-packet";
import ClientSetControlPacket from "networking/packets/client-set-control-packet";
import ClientTokenRequestPacket from "networking/packets/client-token-request-packet";
import ServerCameraUpdatePacket from "networking/packets/server-camera-update-packet";
import ServerChatMessagePacket from "networking/packets/server-chat-message-packet";
import ServerConnectionPacket from "networking/packets/server-connection-packet";
import ServerDisconnectionPacket from "networking/packets/server-disconnection-packet";
import ServerDisplayPacket from "networking/packets/server-display-packet";
import ServerEntityInspectionListingPacket from "networking/packets/server-entity-inspection-listing-packet";
import ServerResourceListingPacket from "networking/packets/server-resource-listing-packet";
import ServerResourceRepoListPacket from "networking/packets/server-resource-repo-list-packet";
import ServerScriptTextPacket from "networking/packets/server-script-text-packet";
import ServerSoundPacket from "networking/packets/server-sound-packet";
import ServerTokenPacket, { TokenType } from "networking/packets/server-token-packet";
import ResourceAPIInterface from "networking/resource-api-interface";
import path from "path";
import Camera from "rendering/camera";
import ScreenRenderer from "rendering/screen-renderer";
import AudioPlayer from "sound/audio-player";
import UIManager from "ui/ui-manager";

import ConfigurationLoader from "./configuration-loader";

/**
 * The base class of the game. Contains all of the systems necessary to run the game, and the game loop.
 *
 * @export
 * @class Game
 */
export default class Game {
    private _windowInput: WindowInput;
    private _screenRenderer: ScreenRenderer;
    private _audioPlayer: AudioPlayer;
    private _inputHandler: InputHandler;
    private _uiManager: UIManager;
    private _networkSystem: NetworkSystem;
    private _gameLoop: GameLoop;
    private _resourceAPIInterface: ResourceAPIInterface;
    private _resourceAPIURL?: string;
    private _loginAPIURL?: string;
    private _loginToken?: string;
    private _loginUsername?: string;
    private _loginInterface: LoginAPIInterface;
    private _selectedResource?: string;
    private _address?: string;
    private _configurationLoader: ConfigurationLoader;
    /**
     * Creates an instance of Game.
     * This will take in different parameters depending on whether it's running through electron or browser.
     * @param {WindowInput} windowInput The type of WindowInput to use.
     * @memberof Game
     */
    constructor(
            windowInput: WindowInput,
            screenRenderer: ScreenRenderer,
            audioPlayer: AudioPlayer,
            uiManager: UIManager,
            fileSender: ResourceAPIInterface,
            loginInterface: LoginAPIInterface,
            configurationLoader: ConfigurationLoader) {
        setDebugLogTypes([]);

        this._connect = this._connect.bind(this);

        this._windowInput = windowInput;
        this._screenRenderer = screenRenderer;
        this._audioPlayer = audioPlayer;
        this._inputHandler = new InputHandler();
        this._uiManager = uiManager;
        this._resourceAPIInterface = fileSender;
        this._loginInterface = loginInterface;
        this._configurationLoader = configurationLoader;
        this._hookupInputs();
        this._networkSystem = new NetworkSystem();
        this._networkSystem.netEventHandler.addConnectionDelegate((packet: ServerConnectionPacket) => {
            let resourceServerIP = "::1:7778";
            if (this._address !== undefined) {
                resourceServerIP
                    = `${this._address.substr(0, this._address.lastIndexOf(":"))}:${packet.resourceServerIP}`;
            }
            this._resourceAPIURL = resourceServerIP;
            this._resourceAPIInterface.setIP(this._resourceAPIURL);
            this._uiManager.setUI("game");
            console.log("Connected to server.");
        });
        this._networkSystem.netEventHandler.addDisconnectionDelegate((packet: ServerDisconnectionPacket) => {
            console.log("Disconnected from server.");
        });
        this._networkSystem.netEventHandler.addChatMessageDelegate((packet: ServerChatMessagePacket) => {
            console.log("Received message: " + packet.message);
            this._uiManager.gameUI.addChatMessage(packet.message);
        });
        this._networkSystem.netEventHandler.addDisplayDelegate((packet: ServerDisplayPacket) => {
            for (const renderObject of packet.displayPackage) {
                if (this._resourceAPIURL !== undefined) {
                    this._screenRenderer.updateRenderObject(
                        this._resourceAPIURL,
                        renderObject
                    );
                }
            }
            this._inputHandler.updateClickableEntities(packet.displayPackage);
        });
        this._networkSystem.netEventHandler.addSoundPlayDelegate((packet: ServerSoundPacket) => {
            for (const audioObject of packet.audioPackage) {
                if (this._resourceAPIURL !== undefined) {
                    this._audioPlayer.play(
                        this._resourceAPIURL,
                        audioObject
                    );
                }
            }
        });
        this._networkSystem.netEventHandler.addTokenDelegate((packet: ServerTokenPacket) => {
            if (packet.tokenType === TokenType.FileUpload || packet.tokenType === TokenType.FileDelete) {
                this._resourceAPIInterface.supplyToken(packet.token, packet.tokenType);
            }
        });
        this._networkSystem.netEventHandler.addResourceListingDelegate((packet: ServerResourceListingPacket) => {
            this._uiManager.gameUI.setResourceList(packet.resources);
        });
        this._networkSystem.netEventHandler.addEntityInspectListingDelegate(
                (packet: ServerEntityInspectionListingPacket) => {
            this._uiManager.gameUI.setEntityData(packet.components, packet.entityID, packet.controlledByPlayer);
        });
        this._networkSystem.netEventHandler.addResourceRepoListDelegate(
                (packet: ServerResourceRepoListPacket) => {
            this._uiManager.gameUI.setResourceRepoList(packet.resources, packet.search);
        });
        this._networkSystem.netEventHandler.addScriptTextDelegate(
                (packet: ServerScriptTextPacket) => {
            this._uiManager.gameUI.setEditingScriptText(packet.scriptID, packet.script);
        });
        this._networkSystem.netEventHandler.addCameraUpdateDelegate(
                (packet: ServerCameraUpdatePacket) => {
            this._screenRenderer.updateCamera(packet.x, packet.y, packet.scale, packet.scale);
        });
        this._uiManager.gameUI.onPlayerMessageEntry = (message: string) => {
            console.log("Sent message: " + message);
            const packet = new ClientChatMessagePacket(message);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.ChatMessage, packet)
            );
        };
        this._uiManager.gameUI.onToolChange = (tool: ToolType) => {
            this._inputHandler.setTool(tool);
        };
        this._uiManager.gameUI.onResourceUpload = (files: FileList, resourceID?: string) => {
            if (this._resourceAPIURL !== undefined) {
                this._resourceAPIInterface.send(files, resourceID);
            }
        };
        this._uiManager.gameUI.onResourceDelete = (resourceID: string) => {
            if (this._resourceAPIURL !== undefined) {
                this._resourceAPIInterface.delete(resourceID);
            }
        };
        this._uiManager.gameUI.onScriptRun = (resourceID: string, args: string, entityID?: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.ExecuteScript,
                    new ClientExecuteScriptPacket(resourceID, args, entityID)
                )
            );
        };
        this._uiManager.gameUI.onResourceInfoModify = (resourceID: string, attribute: string, value: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.ModifyMetadata,
                    new ClientModifyMetadataPacket(resourceID, attribute, value)
                )
            );
        };
        this._uiManager.gameUI.onComponentDelete = (componentID: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.RemoveComponent,
                    new ClientRemoveComponentPacket(componentID)
                )
            );
        };
        this._uiManager.gameUI.onComponentEnableState = (componentID: string, state: boolean) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.SetComponentEnableState,
                    new ClientSetComponentEnableStatePacket(componentID, state)
                )
            );
        };
        this._uiManager.gameUI.onEntityControl = (entityID?: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.SetControl,
                    new ClientSetControlPacket(entityID)
                )
            );
        };
        this._uiManager.gameUI.onCloneResource = (resourceID: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.CloneResource,
                    new ClientCloneResourcePacket(resourceID)
                )
            );
        };
        this._uiManager.gameUI.onSearchResourceRepo = (search: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.SearchResourceRepo,
                    new ClientSearchResourceRepoPacket(search)
                )
            );
        };
        this._uiManager.gameUI.onRequestEditScript = (scriptID: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.RequestEditScript,
                    new ClientRequestEditScriptPacket(scriptID)
                )
            );
        };
        this._uiManager.gameUI.onEditScript = (scriptID: string, script: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.EditScript,
                    new ClientEditScriptPacket(scriptID, script)
                )
            );
        };
        this._uiManager.gameUI.onModifyComponentMeta = (componentID: string, option: string, value: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.ModifyComponentMeta,
                    new ClientModifyComponentMetaPacket(componentID, option, value)
                )
            );
        };
        this._uiManager.gameUI.onMakePrefab = (entityID: string) => {
            this._networkSystem.queue(
                new ClientNetEvent(
                    ClientEventType.CreatePrefab,
                    new ClientPrefabCreationPacket(entityID)
                )
            );
        };
        this._uiManager.gameUI.onResourceSelect = (resourceID: string | undefined) => {
            this._selectedResource = resourceID;
        };
        this._uiManager.loginUI.onLogin = (username: string, token: string) => {
            this._loginToken = token;
            this._loginUsername = username;
            this._uiManager.loginUI.setMenu("connect");
        };
        this._uiManager.loginUI.onLoginAttempt = (username: string, password: string) => {
            this._loginInterface.login(username, password)
                .then((res) => {
                    this._uiManager.loginUI.onLogin(username, res);
                })
                .catch((err) => {
                    this._uiManager.loginUI.setStatus(err);
                });
        };
        this._uiManager.loginUI.onSignup = (username: string, email: string, password: string) => {
            this._loginInterface.signup(username, email, password)
                .then((res) => {
                    this._uiManager.loginUI.setStatus(res);
                })
                .catch((err) => {
                    this._uiManager.loginUI.setStatus(err);
                });
        };
        this._uiManager.loginUI.onConnect = this._connect;

        this._screenRenderer.reportCameraChange = (camera: Camera) => {
            this._inputHandler.updateCamera(camera);
        };

        this._resourceAPIInterface.onTokenRequest = (tokenType: TokenType) => {
            const packet = new ClientTokenRequestPacket(tokenType);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.TokenRequest, packet)
            );
        };
        this._gameLoop = new GameLoop(this._tick.bind(this), 60);
    }
    /**
     * Start the game.
     *
     * @memberof Game
     */
    public async start() {
        await this.loadConfiguration(path.join(__dirname, "..", "config.json"));
        this._loginInterface.setURL(this._loginAPIURL!);
        this._gameLoop.start();
    }

    private _connect(address: string) {
        this._address = address;
        this._networkSystem.connect(address, this._loginUsername!, this._loginToken!);
    }

    /**
     * Perform one game tick.
     *
     * @private
     * @memberof Game
     */
    private _tick() {
        this._windowInput.queryGamepads();
        this._screenRenderer.update();
        this._uiManager.render();
        if (this._networkSystem.connected) {
            this._networkSystem.sendMessages();
        }
    }

    private async loadConfiguration(loadPath: string) {
        const config = await this._configurationLoader.loadConfig(loadPath);
        this._loginAPIURL = config.loginURL;
    }

    private _hookupInputs() {
        this._windowInput.onKeyPressed = (event: KeyInputEvent) => {
            this._inputHandler.handleKeyPress(event);
        };
        this._windowInput.onKeyReleased = (event: KeyInputEvent) => {
            this._inputHandler.handleKeyRelease(event);
        };
        this._windowInput.onMousePressed = (event: MouseInputEvent) => {
            this._inputHandler.handleMousePress(event);
        };
        this._windowInput.onMouseReleased = (event: MouseInputEvent) => {
            this._inputHandler.handleMouseRelease(event);
        };
        this._windowInput.onMouseMoved = (event: MouseInputEvent) => {
            this._inputHandler.handleMouseMove(event);
        };
        this._inputHandler.onKeyPress = (event: KeyInputEvent) => {
            const packet = new ClientKeyboardInputPacket(event.key, event.state, event.device);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.Input, packet)
            );
        };
        this._inputHandler.onKeyRelease = (event: KeyInputEvent) => {
            const packet = new ClientKeyboardInputPacket(event.key, event.state, event.device);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.Input, packet)
            );
        };
        this._inputHandler.onPlace = (x: number, y: number) => {
            const prefabID = this._selectedResource === undefined ? "" : this._selectedResource;
            const packet = new ClientEntityCreationPacket(prefabID!, x, y);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.EntityCreation, packet)
            );
        };
        this._inputHandler.onErase = (id: string) => {
            const packet = new ClientEntityDeletionPacket(id);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.EntityDeletion, packet)
            );
        };
        this._inputHandler.onEdit = (id: string | undefined) => {
            const packet = new ClientEntityInspectionPacket(id);
            this._networkSystem.queue(
                new ClientNetEvent(ClientEventType.EntityInspection, packet)
            );
            this._uiManager.gameUI.inspect(id);
        };
    }
}
