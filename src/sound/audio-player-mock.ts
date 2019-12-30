import {WebContents} from "electron";
import ipcMessages from "ipc/ipc-messages";
import AudioObject from "resource-management/audio-object";
import AudioPlayer from "./audio-player";

/**
 * A mock for the audio player.
 * This has no behaviour.
 *
 * @export
 * @class AudioPlayerMock
 * @extends {AudioPlayer}
 */
export default class AudioPlayerMock extends AudioPlayer {
    public play(resourceIP: string, sound: AudioObject) { }
    public stop(soundID?: string) { }
    public pause(soundID: string) { }
    public resume(soundID: string) { }
    public setVolume(soundID: string, volume: number) { }
}
