import IPConverter from "core/ip-converter";
import path from "path";
import * as PIXI from "pixi.js";
// tslint:disable-next-line: ordered-imports
import SOUND from "pixi-sound";
(PIXI as any).sound = SOUND;

/**
 * A class which handles fetching textures from a URL
 * This will automatically queue a texture to fetch if it cannot be found
 * Queued textures will be loaded if possible on update
 *
 * @export
 * @class TextureFetcher
 */
export default class ResourceFetcher<T> {
    private _freeLoaders: {[id: string]: PIXI.Loader[]};
    private _resources: Map<string, Promise<T>>;
    private _kind: string;
    private _getFromResource: (res: PIXI.LoaderResource) => T;

    /**
     * Creates an instance of TextureFetcher.
     * @param {string} baseURL The base URL to fetch resources from
     * @memberof TextureFetcher
     */
    constructor(kind: string, getFromResource: (res: PIXI.LoaderResource) => T) {
        this._getFromResource = getFromResource;
        this._freeLoaders = {};
        this._resources = new Map<string, Promise<T>>();
        this._kind = kind;
    }

    /**
     * Asynchronously get a texture by its ID.
     * This will automatically load the texture if it is not already loaded.
     *
     * @param {string} id The ID of the texture to load
     * @returns {Promise<T>} A promise which resolves to the base texture when loaded.
     * This rejects with an error if texture loading failed for whatever reason.
     * @memberof TextureFetcher
     */
    public async get(htmlIP: string, id: string): Promise<T> {
        let resourcePromise = this._resources.get(id);
        // Auto load the image if it doesn't exist
        if (resourcePromise === undefined) {
            const url = IPConverter.toHTTP(htmlIP);
            const imagePath = path.join(this._kind, id);
            console.log(imagePath);
            resourcePromise = this.loadResource(url, imagePath, id);
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
    public async loadResource(baseURL: string, resPath: string, id: string): Promise<T> {
        if (this._freeLoaders[baseURL] === undefined) {
            this._freeLoaders[baseURL] = [];
        }
        const loaderSet = this._freeLoaders[baseURL];
        let loader = loaderSet.pop()!;
        // If there was no free loader, make a new one
        if (loader === undefined) {
            loader = new PIXI.Loader(baseURL);
        }
        const promise = new Promise<T>((resolve, reject) => {
            let loadType = PIXI.LoaderResource.LOAD_TYPE.XHR;
            let xhrType = PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER;
            if (this._kind === "image") {
                loadType = PIXI.LoaderResource.LOAD_TYPE.IMAGE;
                xhrType = PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB;
            }
            loader.add(id, resPath, {loadType, xhrType});
            loader.load((retunedloader: any, resources: any) => {
                const error = resources[id].error;
                if (error) {
                    reject(error);
                    return;
                }
                const res = this._getFromResource(resources[id]);
                loader.reset();
                this._freeLoaders[baseURL].push(loader);
                resolve(res);
            });
        });
        this._resources.set(id, promise);
        return promise;
    }
}
