import {WebContents} from "electron";
import ipcMessages from "ipc/ipc-messages";
import AudioObject from "resource-management/audio-object";
import AudioPlayer from "./audio-player";

export default class AudioPlayerMock extends AudioPlayer {
    public play(resourceIP: string, sound: AudioObject) { }
    public stop(soundID?: string) { }
    public pause(soundID: string) { }
    public resume(soundID: string) { }
    public setVolume(soundID: string, volume: number) { }
}
