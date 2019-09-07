import AudioObject from "resource-management/audio-object";

export default abstract class AudioPlayer {
    public abstract play(sound: AudioObject): void;
    public abstract stop(soundID?: string): void;
    public abstract pause(soundID: string): void;
    public abstract resume(soundID: string): void;
    public abstract setVolume(soundID: string, volume: number): void;
}
