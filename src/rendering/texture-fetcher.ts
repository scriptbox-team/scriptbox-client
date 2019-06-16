import Path from "path";
import * as PIXI from "pixi.js";

/**
 * A class which handles fetching textures from a URL
 * This will automatically queue a texture to fetch if it cannot be found
 * Queued textures will be loaded if possible on update
 *
 * @export
 * @class TextureFetcher
 */
export default class TextureFetcher {
    private _baseURL: string;
    private _queue: string[];
    private _freeLoaders: Array<PIXI.Loader>;
    private _occupiedLoaders: Array<PIXI.Loader>;
    private _promiseQueue: Array<{id: string, promiseResolve: Function}>;
    private _resources: Map<string, PIXI.BaseTexture>;

    /**
     * Creates an instance of TextureFetcher.
     * @param {string} baseURL The base URL to fetch resources from
     * @memberof TextureFetcher
     */
    constructor(baseURL: string) {
        this._baseURL = baseURL;
        this._queue = [];
        this._promiseQueue = [];
        this._freeLoaders = [];
        this._occupiedLoaders = [];
        this._resources = new Map<string, PIXI.BaseTexture>();

        const loaderPoolSize = 5;
        for (let i = 0; i < loaderPoolSize; i++) {
            this._freeLoaders.push(new PIXI.Loader());
        }
    }

    /**
     * Get a base texture by its ID.
     * If the texture has not been loaded, it will be automatially queued for loading.
     *
     * @param {string} id The ID of the base texture to fetch
     * @returns {(PIXI.BaseTexture | undefined)} The base texture if loaded, undefined if ont loaded
     * @memberof TextureFetcher
     */
    public get(id: string): Promise<PIXI.BaseTexture> {
        const url = Path.join(this._baseURL, "img", id);
        const resource = this._resources.get(url);
        // Auto load the image if it doesn't exist
        if (resource === undefined) {
            return this.queue(id);
        }
        else {
            return Promise.resolve(resource);
        }
    }

    /**
     * Queue a texture to load by its ID
     *
     * @param {string} id The ID of a texture to load
     * @memberof TextureFetcher
     */
    public queue(id: string) : Promise<PIXI.BaseTexture> {
        const promise = new Promise<PIXI.BaseTexture>((resolve, reject) => {
            this._promiseQueue.push({id, promiseResolve: resolve});
        });
        this._queue.push(id);
        return promise;
    }

    /**
     * If there are queued textures and the loader isn't running, fetch textures
     *
     * @memberof TextureFetcher
     */
    public update() {
        if (this._queue.length > 0 && this._freeLoaders.length > 0) {
            this.loadQueued();
        }
    }

    private loadQueued() {
        const loader = this._freeLoaders.pop();
        if (loader !== undefined) {
            loader.reset();
            for (const r of this._queue) {
                loader.add(r);
            }
            loader.load((fetchedResources: any) => {
                for (const key of fetchedResources.keys()) {
                    this._resources.set(key, fetchedResources[key].baseTexture);
                }
                for (const promiseObject of this._promiseQueue) {
                    promiseObject.promiseResolve(fetchedResources[promiseObject.id].baseTexture);
                }
            });

            this._queue = [];
        }
    }
}
