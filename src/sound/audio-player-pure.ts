import IPConverter from "core/ip-converter";
import path from "path";
import * as PIXI from "pixi.js";
import AudioObject from "resource-management/audio-object";
import ResourceFetcher from "resource-management/resource-fetcher";

import AudioPlayer from "./audio-player";

export default class AudioPlayerPure extends AudioPlayer {
    private _soundFetcher: ResourceFetcher<PIXI.sound.Sound>;
    private _activeSounds: {[id: string]: PIXI.sound.IMediaInstance};
    constructor() {
        super();
        this._soundFetcher = new ResourceFetcher<PIXI.sound.Sound>("audio", (res) => {
            console.log(res);
            return res.sound;
        });
        this._activeSounds = {};
    }
    public async play(resourceIP: string, sound: AudioObject) {
        const url = IPConverter.toHTTP(resourceIP);
        const audioPath = path.join(url, "audio", sound.resource);
        const soundResource = PIXI.sound.Sound.from(audioPath);
        console.log(soundResource);
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
                delete this._activeSounds[key];
            }
            return;
        }
        if (this._activeSounds[soundID] !== undefined) {
            this._activeSounds[soundID].stop();
            delete this._activeSounds[soundID];
        }
    }
    public pause(soundID: string) {
        if (this._activeSounds[soundID] !== undefined) {
            this._activeSounds[soundID].set("paused", true);
        }
    }
    public resume(soundID: string) {
        if (this._activeSounds[soundID] !== undefined) {
            this._activeSounds[soundID].set("paused", false);
        }
    }
    public setVolume(soundID: string, volume: number) {
        if (this._activeSounds[soundID] !== undefined) {
            this._activeSounds[soundID].set("volume", volume);
        }
    }
}
