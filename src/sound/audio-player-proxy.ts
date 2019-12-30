import {WebContents} from "electron";
import ipcMessages from "ipc/ipc-messages";
import AudioObject from "resource-management/audio-object";
import AudioPlayer from "./audio-player";

/**
 * The proxy side of the AudioPlayer.
 * This sends commands to the browser side.
 *
 * @export
 * @class AudioPlayerProxy
 * @extends {AudioPlayer}
 */
export default class AudioPlayerProxy extends AudioPlayer {
    private _webContents: WebContents;
    /**
     * Creates an instance of AudioPlayerProxy.
     * @param {WebContents} webContents The WebContents to send calls to.
     * @memberof AudioPlayerProxy
     */
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
    }
    /**
     * Play an audio resource.
     *
     * @param {string} resourceIP The IP to retrieve the resource from.
     * @param {AudioObject} sound The audio object to play.
     * @memberof AudioPlayerProxy
     */
    public play(resourceIP: string, sound: AudioObject) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.PlaySound, resourceIP, sound);
        }
    }
    /**
     * Stop playing a sound.
     *
     * @param {string} [soundID] The ID of the sound to stop.
     * @memberof AudioPlayerProxy
     */
    public stop(soundID?: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.StopSound, soundID);
        }
    }
    /**
     * Pause a sound.
     *
     * @param {string} soundID The ID of the sound to pause.
     * @memberof AudioPlayerProxy
     */
    public pause(soundID: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.PauseSound, soundID);
        }
    }
    /**
     * Resume a sound.
     *
     * @param {string} soundID The ID of the sound to resume.
     * @memberof AudioPlayerProxy
     */
    public resume(soundID: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResumeSound, soundID);
        }
    }
    /**
     * Set the volume of an existing sound.
     *
     * @param {string} soundID The ID of the sound to set the volume of.
     * @param {number} volume The volume to set the sound to.
     * @memberof AudioPlayerProxy
     */
    public setVolume(soundID: string, volume: number) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetVolume, soundID, volume);
        }
    }
}
