import "pixi-sound";
import "pixi.js";
import AudioObject from "resource-management/audio-object";
import ResourceFetcher from "resource-management/resource-fetcher";
import AudioPlayer from "./audio-player";

export class AudioPlayerPure extends AudioPlayer {
    private _soundFetcher: ResourceFetcher<PIXI.sound.Sound>;
    private _activeSounds: {[id: string]: PIXI.sound.IMediaInstance};
    constructor() {
        super();
        this._soundFetcher = new ResourceFetcher<PIXI.sound.Sound>(".");
        this._activeSounds = {};
    }
    public async play(sound: AudioObject) {
        const soundResource = await this._soundFetcher.get(sound.resource)
        soundResource.volume = sound.volume;
        soundResource.loop = sound.loop;
        if (this._activeSounds[sound.id] !== undefined) {
            this._activeSounds[sound.id].destroy();
        }
        this._activeSounds[sound.id] = await soundResource.play();
    }
    public stop(soundID?: string) {
        if (soundID === undefined) {
            for (const key of Object.keys(this._activeSounds)) {
                this._activeSounds[key].stop();
            }
            return;
        }
        this._activeSounds[soundID].stop();
    }
    public pause(soundID: string) {
        this._activeSounds[soundID].set("paused", true);
    }
    public resume(soundID: string) {
        this._activeSounds[soundID].set("paused", false);
    }
    public setVolume(soundID: string, volume: number) {
        this._activeSounds[soundID].set("volume", volume);
    }
}
