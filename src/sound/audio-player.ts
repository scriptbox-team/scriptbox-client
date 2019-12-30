import AudioObject from "resource-management/audio-object";

/**
 * A class which is capable of playing audio to the client.
 *
 * @export
 * @abstract
 * @class AudioPlayer
 */
export default abstract class AudioPlayer {
    /**
     * Play an audio resource.
     *
     * @abstract
     * @param {string} resourceIP The IP to retrieve the resource from.
     * @param {AudioObject} sound The audio object to play.
     * @memberof AudioPlayer
     */
    public abstract play(resourceIP: string, sound: AudioObject): void;
    /**
     * Stop playing a sound.
     *
     * @abstract
     * @param {string} [soundID] The ID of the sound to stop.
     * @memberof AudioPlayer
     */
    public abstract stop(soundID?: string): void;
    /**
     * Pause a sound.
     *
     * @abstract
     * @param {string} soundID The ID of the sound to pause.
     * @memberof AudioPlayer
     */
    public abstract pause(soundID: string): void;
    /**
     * Resume a sound.
     *
     * @abstract
     * @param {string} soundID The ID of the sound to resume.
     * @memberof AudioPlayer
     */
    public abstract resume(soundID: string): void;
    /**
     * Set the volume of an existing sound.
     *
     * @abstract
     * @param {string} soundID The ID of the sound to set the volume of.
     * @param {number} volume The volume to set the sound to.
     * @memberof AudioPlayer
     */
    public abstract setVolume(soundID: string, volume: number): void;
}
