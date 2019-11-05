import IPConverter from "core/ip-converter";
import path from "path";
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
    private _freeLoaders: PIXI.Loader[];
    private _resources: Map<string, Promise<PIXI.BaseTexture>>;

    /**
     * Creates an instance of TextureFetcher.
     * @param {string} baseURL The base URL to fetch resources from
     * @memberof TextureFetcher
     */
    constructor() {
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
    public async get(htmlIP: string, id: string): Promise<PIXI.BaseTexture> {
        let resourcePromise = this._resources.get(id);
        // Auto load the image if it doesn't exist
        if (resourcePromise === undefined) {
            const url = IPConverter.toHTTP(htmlIP);
            const imagePath = path.join(url, "image", id);
            resourcePromise = this.loadResource(imagePath, id);
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
    public async loadResource(url: string, id: string): Promise<PIXI.BaseTexture> {
        let loader = this._freeLoaders.pop()!;
        // If there was no free loader, make a new one
        if (loader === undefined) {
            loader = new PIXI.Loader();
        }
        const promise = new Promise<PIXI.BaseTexture>((resolve, reject) => {
            loader.add(id, url, {
                loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE,
                xhrType: PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB
            });
            loader.load((retunedloader: any, resources: any) => {
                const error = resources[id].error;
                if (error) {
                    reject(error);
                    return;
                }
                console.log(resources);
                const res = resources[id].texture.baseTexture;
                loader.reset();
                this._freeLoaders.push(loader);
                resolve(res);
            });
        });
        this._resources.set(id, promise);
        return promise;
    }
}
