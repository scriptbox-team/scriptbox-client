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
    private _freeLoaders: PIXI.Loader[];
    private _resources: Map<string, Promise<PIXI.BaseTexture>>;

    /**
     * Creates an instance of TextureFetcher.
     * @param {string} baseURL The base URL to fetch resources from
     * @memberof TextureFetcher
     */
    constructor(baseURL: string) {
        this._baseURL = baseURL;
        this._freeLoaders = [];
        this._resources = new Map<string, Promise<PIXI.BaseTexture>>();
    }

    /**
     * Asynchronously get a texture by its ID.
     * This will automatically load the texture if it is not already loaded.
     *
     * @param {string} id The ID of the texture to load
     * @returns {Promise<PIXI.BaseTexture>} A promise which resolves to the base texture when loaded.
     * This rejects with an error if texture loading failed for whatever reason.
     * @memberof TextureFetcher
     */
    public async get(id: string): Promise<PIXI.BaseTexture> {
        const url = Path.join(this._baseURL, "img", id);
        let resourcePromise = this._resources.get(url);
        // Auto load the image if it doesn't exist
        if (resourcePromise === undefined) {
            resourcePromise = this.loadResource(url);
        }
        return await resourcePromise;
    }

    /**
     * Load a texture asynchronously.
     *
     * @param {string} url The URL of the texture to load.
     * @returns {Promise<PIXI.BaseTexture>} A promise which resolves to the base texture when loaded.
     * This rejects with an error if texture loading failed for whatever reason.
     * @memberof TextureFetcher
     */
    public async loadResource(url: string): Promise<PIXI.BaseTexture> {
        let loader = this._freeLoaders.pop()!;
        // If there was no free loader, make a new one
        if (loader === undefined) {
            loader = new PIXI.Loader();
        }
        const promise = new Promise<PIXI.BaseTexture>((resolve, reject) => {
            loader.add(url);
            loader.load((retunedloader: any, resources: any) => {
                const error = resources[url].error;
                if (error) {
                    reject(error);
                    return;
                }
                const res = resources[url].texture.baseTexture;
                loader.reset();
                this._freeLoaders.push(loader);
                resolve(res);
            });
        });
        this._resources.set(url, promise);
        return promise;
    }
}
