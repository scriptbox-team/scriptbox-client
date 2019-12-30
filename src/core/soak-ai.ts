import { DeviceType, InputType } from "input/input-event";
import ClientNetEvent, { ClientEventType } from "networking/client-net-event";
import NetworkSystem from "networking/network-system";
import ClientChatMessagePacket from "networking/packets/client-chat-message-packet";
import ClientEntityCreationPacket from "networking/packets/client-entity-creation-packet";
import ClientEntityDeletionPacket from "networking/packets/client-entity-deletion-packet";
import ClientKeyboardInputPacket from "networking/packets/client-keyboard-input-packet";
import RenderObject from "resource-management/render-object";

enum UpcomingEvent {
    UpRelease,
    LeftRelease,
    DownRelease,
    RightRelease,
}

/**
 * A set of behaviours that are used to run the soak test AI.
 * This includes random movement, script execution, and deleting and creating entities.
 *
 * @export
 * @class SoakAI
 */
export default class SoakAI {
    private _upcomingEvents: Array<{time: number, event: UpcomingEvent}>;
    private _visibleObjects: Map<string, RenderObject>;
    private _position: {x: number, y: number};
    private _networkSystem: NetworkSystem;
    private _testing: boolean;
    private _testEndTime: number;
    private _login: string;
    /**
     * Creates an instance of SoakAI.
     * @param {NetworkSystem} networkSystem The network system to send the behaviours to.
     * @param {string} login The username to use for logging in.
     * @param {number} testEndTime The amount of time to continue running for.
     * @memberof SoakAI
     */
    constructor(networkSystem: NetworkSystem, login: string, testEndTime: number) {
        this._networkSystem = networkSystem;
        this._upcomingEvents = [];
        this._visibleObjects = new Map<string, RenderObject>();
        this._position = {x: 0, y: 0};
        this._testing = true;
        this._login = login;
        this._testEndTime = testEndTime;
        console.log("Soak test client \"" + this._login
        + "\" connected at " + new Date().toString() + ". Test will end at "
        + new Date(this._testEndTime).toString() + ".");
    }
    /**
     * Update which objects are in view for the AI.
     *
     * @param {RenderObject} visibleObject The objects which are visible to the AI
     * @returns
     * @memberof SoakAI
     */
    public updateVisibleObject(visibleObject: RenderObject) {
        if (visibleObject.deleted) {
            this._visibleObjects.delete(visibleObject.id);
            return;
        }
        this._visibleObjects.set(visibleObject.id, visibleObject);
    }
    /**
     * Update the position of the AI.
     *
     * @param {{x: number, y: number}} pos The new position of the AI.
     * @memberof SoakAI
     */
    public updatePosition(pos: {x: number, y: number}) {
        this._position = pos;
    }
    /**
     * Perform any per-tick behaviours.
     *
     * @returns
     * @memberof SoakAI
     */
    public update() {
        if (this._testing && this._random(200) === 0) {
            const now = Date.now();
            if (now > this._testEndTime) {
                console.log("Soak test client \"" + this._login
                + "\" finished at " + new Date().toString() + ".");
                this._testing = false;
                return;
            }
            const newEvents = [] as Array<{time: number, event: UpcomingEvent}>;
            for (const event of this._upcomingEvents) {
                if (now > event.time) {
                    switch (event.event) {
                        case UpcomingEvent.UpRelease:
                            this._networkSystem.queue(
                                new ClientNetEvent(
                                    ClientEventType.Input,
                                    new ClientKeyboardInputPacket(
                                        38,
                                        InputType.Release,
                                        DeviceType.Keyboard
                                    )
                                )
                            );
                            break;
                        case UpcomingEvent.LeftRelease:
                            this._networkSystem.queue(
                                new ClientNetEvent(
                                    ClientEventType.Input,
                                    new ClientKeyboardInputPacket(
                                        37,
                                        InputType.Release,
                                        DeviceType.Keyboard
                                    )
                                )
                            );
                            break;
                        case UpcomingEvent.DownRelease:
                            this._networkSystem.queue(
                                new ClientNetEvent(
                                    ClientEventType.Input,
                                    new ClientKeyboardInputPacket(
                                        40,
                                        InputType.Release,
                                        DeviceType.Keyboard
                                    )
                                )
                            );
                            break;
                        case UpcomingEvent.RightRelease:
                            this._networkSystem.queue(
                                new ClientNetEvent(
                                    ClientEventType.Input,
                                    new ClientKeyboardInputPacket(
                                        39,
                                        InputType.Release,
                                        DeviceType.Keyboard
                                    )
                                )
                            );
                            break;
                    }
                }
                else {
                    newEvents.push(event);
                }
            }
            this._upcomingEvents = newEvents;
            switch (this._random(25)) {
                case 0: case 1: case 2: case 3: {
                    // Hit up
                    this._networkSystem.queue(
                        new ClientNetEvent(
                            ClientEventType.Input,
                            new ClientKeyboardInputPacket(
                                38,
                                InputType.Press,
                                DeviceType.Keyboard
                            )
                        )
                    );
                    this._upcomingEvents.push({
                        time: Date.now() + this._random(1500),
                        event: UpcomingEvent.UpRelease
                    });
                    break;
                }
                case 4: case 5: case 6: case 7: {
                    // Hit left
                    this._networkSystem.queue(
                        new ClientNetEvent(
                            ClientEventType.Input,
                            new ClientKeyboardInputPacket(
                                37,
                                InputType.Press,
                                DeviceType.Keyboard
                            )
                        )
                    );
                    this._upcomingEvents.push({
                        time: Date.now() + this._random(1500),
                        event: UpcomingEvent.LeftRelease
                    });
                    break;
                }
                case 8: case 9: case 10: case 11: {
                    // Hit down
                    this._networkSystem.queue(
                        new ClientNetEvent(
                            ClientEventType.Input,
                            new ClientKeyboardInputPacket(
                                40,
                                InputType.Press,
                                DeviceType.Keyboard
                            )
                        )
                    );
                    this._upcomingEvents.push({
                        time: Date.now() + this._random(1500),
                        event: UpcomingEvent.DownRelease
                    });
                    break;
                }
                case 12: case 13: case 14: case 15: {
                    // Hit right
                    this._networkSystem.queue(
                        new ClientNetEvent(
                            ClientEventType.Input,
                            new ClientKeyboardInputPacket(
                                39,
                                InputType.Press,
                                DeviceType.Keyboard
                            )
                        )
                    );
                    this._upcomingEvents.push({
                        time: Date.now() + this._random(1500),
                        event: UpcomingEvent.RightRelease
                    });
                    break;
                }
                case 16: case 17: case 18: {
                    // Create object
                    this._networkSystem.queue(
                        new ClientNetEvent(
                            ClientEventType.EntityCreation,
                            new ClientEntityCreationPacket(
                                "",
                                this._position.x + this._random(1600) - 800,
                                this._position.y + this._random(1600) - 800
                            )
                        )
                    );
                    break;
                }
                case 19: case 20: case 21: {
                    // Delete object
                    const objs = Array.from(this._visibleObjects.values());
                    if (objs.length > 0) {
                        const target = objs[this._random(objs.length)];
                        if (target.ownerID !== undefined) {
                            this._networkSystem.queue(
                                new ClientNetEvent(
                                    ClientEventType.EntityDeletion,
                                    new ClientEntityDeletionPacket(
                                        target.ownerID
                                    )
                                )
                            );
                        }
                    }
                    break;
                }
                case 22: {
                    // Run infinite loop script
                    this._networkSystem.queue(
                        new ClientNetEvent(
                            ClientEventType.ChatMessage,
                            new ClientChatMessagePacket(
                                ">> while(true){}"
                            )
                        )
                    );
                    break;
                }
                case 23: {
                    // Run calculation script
                    this._networkSystem.queue(
                        new ClientNetEvent(
                            ClientEventType.ChatMessage,
                            new ClientChatMessagePacket(
                                ">> Math.sqrt(1 + Math.random() * 100) ** (Math.random() * 50)"
                            )
                        )
                    );
                    break;
                }
            }
        }
    }
    /**
     * Generate a random integer
     *
     * @private
     * @param {number} num The exclusive ceiling of the number to generate
     * @returns The generated number
     * @memberof SoakAI
     */
    private _random(num: number) {
        return Math.floor(Math.random() * num);
    }
}
