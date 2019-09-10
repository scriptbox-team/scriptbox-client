import {WebContents} from "electron";
import ipcMessages from "ipc/ipc-messages";
import AudioObject from "resource-management/audio-object";
import AudioPlayer from "./audio-player";

export class AudioPlayerProxy extends AudioPlayer {
    private _webContents: WebContents;
    constructor(webContents: WebContents) {
        super();
        this._webContents = webContents;
    }
    public play(sound: AudioObject) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.PlaySound, sound);
        }
    }
    public stop(soundID?: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.StopSound, soundID);
        }
    }
    public pause(soundID: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.PauseSound, soundID);
        }
    }
    public resume(soundID: string) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.ResumeSound, soundID);
        }
    }
    public setVolume(soundID: string, volume: number) {
        if (!this._webContents.isDestroyed()) {
            this._webContents.send(ipcMessages.SetVolume, soundID, volume);
        }
    }
}
