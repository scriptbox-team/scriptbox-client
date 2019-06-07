/**
 * A manager which handles associating IDs with local resources
 * This will also eventually unload resources that have not been used for a while
 *
 * @export
 * @class ResourceManager
 */
export default class ResourceManager<T> {
    /**
     * The callback to trigger when getResource is called and the resource can't be found
     *
     * @memberof ResourceManager
     */
    public onResourceMissing?: (id: string) => void;
    private _resources: Map<string, T>;
    /**
     * Creates an instance of ResourceManager.
     * @memberof ResourceManager
     */
    constructor() {
        this._resources = new Map<string, T>();
    }
    /**
     * Gets a resource from the resource manager.
     * Will return the resource if it exists, undefined if it does not.
     * this will call onResourceMissing if the resource was not found.
     *
     * @param {string} id The ID of the resource
     * @returns {(T | undefined)} The resource if found, undefined otherwise
     * @memberof ResourceManager
     */
    public get(id: string): T | undefined {
        const resource = this._resources.get(id);
        if (resource === undefined && this.onResourceMissing !== undefined) {
            this.onResourceMissing(id);
        }
        return resource;
    }
    /**
     * Put a resource in the manager at the specified ID
     *
     * @param {string} id The ID to set
     * @param {T} data The resource to add
     * @memberof ResourceManager
     */
    public set(id: string, data: T) {
        this._resources.set(id, data);
    }
}
