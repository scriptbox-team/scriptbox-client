import IPConverter from "core/ip-converter";
import path from "path";
import * as PIXI from "pixi.js";
import AudioObject from "resource-management/audio-object";
import ResourceFetcher from "resource-management/resource-fetcher";

import AudioPlayer from "./audio-player";

/**
 * The browser side of the audio player.
 * This uses pixi-sound to play audio files.
 *
 * @export
 * @class AudioPlayerPure
 * @extends {AudioPlayer}
 */
export default class AudioPlayerPure extends AudioPlayer {
    private _soundFetcher: ResourceFetcher<PIXI.sound.Sound>;
    private _activeSounds: {[id: string]: PIXI.sound.IMediaInstance};
    /**
     * Creates an instance of AudioPlayerPure.
     * @memberof AudioPlayerPure
     */
    constructor() {
        super();
        this._soundFetcher = new ResourceFetcher<PIXI.sound.Sound>("audio", (res) => {
            return PIXI.sound.Sound.from({source: res.data});
        });
        this._activeSounds = {};
    }
    /**
     * Play an audio resource.
     *
     * @param {string} resourceIP The IP to retrieve the resource from.
     * @param {AudioObject} sound The audio object to play.
     * @memberof AudioPlayerPure
     */
    public async play(resourceIP: string, sound: AudioObject) {
        const soundResource = await this._soundFetcher.get(resourceIP, sound.resource);
        console.log(soundResource);
        soundResource.volume = sound.volume;
        soundResource.loop = sound.loop;
        if (this._activeSounds[sound.id] !== undefined) {
            this._activeSounds[sound.id].destroy();
        }
        this._activeSounds[sound.id] = await soundResource.play();
    }
    /**
     * Stop playing a sound.
     *
     * @param {string} [soundID] The ID of the sound to stop.
     * @memberof AudioPlayerPure
     */
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
    /**
     * Pause a sound.
     *
     * @param {string} soundID The ID of the sound to pause.
     * @memberof AudioPlayerPure
     */
    public pause(soundID: string) {
        if (this._activeSounds[soundID] !== undefined) {
            this._activeSounds[soundID].set("paused", true);
        }
    }
    /**
     * Resume a sound.
     *
     * @param {string} soundID The ID of the sound to resume.
     * @memberof AudioPlayerPure
     */
    public resume(soundID: string) {
        if (this._activeSounds[soundID] !== undefined) {
            this._activeSounds[soundID].set("paused", false);
        }
    }
    /**
     * Set the volume of an existing sound.
     *
     * @param {string} soundID The ID of the sound to set the volume of.
     * @param {number} volume The volume to set the sound to.
     * @memberof AudioPlayerPure
     */
    public setVolume(soundID: string, volume: number) {
        if (this._activeSounds[soundID] !== undefined) {
            this._activeSounds[soundID].set("volume", volume);
        }
    }
}
