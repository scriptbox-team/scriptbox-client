import * as PIXI from "pixi.js";
import RenderObject from "resource-management/render-object";
import TextureFetcher from "resource-management/texture-fetcher";
import ScreenRenderer from "./screen-renderer";

/**
 * The implementation of the screen renderer.
 * This handles making calls to the pixi.js API to update the screen.
 *
 * @export
 * @class ScreenRendererPure
 * @extends {ScreenRenderer}
 */
export default class ScreenRendererPure extends ScreenRenderer {
    private _textureFetcher: TextureFetcher;
    private _sprites: Map<string, PIXI.Sprite>;
    private _currentTextures: Map<string, {time: number, texture: string | undefined}>;
    private _app: PIXI.Application;
    /**
     * Creates an instance of ScreenRendererPure.
     * @memberof ScreenRendererPure
     */
    constructor(width: number, height: number) {
        super();
        this.resize = this.resize.bind(this);
        this._app = new PIXI.Application({
            width,
            height,
            antialias: false,
            transparent: false,
            resolution: 1
        });
        const doc = document.getElementById("screen");
        doc!.onselectstart = () => false;
        doc!.appendChild(this._app.view);
        window.addEventListener("resize", this.resize);
        this._sprites = new Map<string, PIXI.Sprite>();
        this._currentTextures = new Map<string, {time: number, texture: string | undefined}>();
        this._app.renderer.autoResize = true;
        this._textureFetcher = new TextureFetcher(".");
        this.resize();
    }
    /**
     * Updates or creates a RenderObject
     *
     * @param {RenderObject} renderObject The RenderObject to add
     * @memberof ScreenRendererPure
     */
    public updateRenderObject(renderObject: RenderObject) {
        // TODO: Allow players to delete render objects
        if (renderObject.deleted) {
            const spriteToDelete = this._sprites.get(renderObject.id);
            if (spriteToDelete !== undefined) {
                spriteToDelete.destroy();
            }
            this._sprites.delete(renderObject.id);
            return;
        }
        let sprite = this._sprites.get(renderObject.id);
        if (sprite === undefined) {
            sprite = new PIXI.Sprite();
            this._sprites.set(renderObject.id, sprite);
            this._app.stage.addChild(sprite);
            this._currentTextures.set(renderObject.id, {time: 0, texture: undefined});
        }

        sprite.x = renderObject.position.x;
        sprite.y = renderObject.position.y;
        sprite.zIndex = renderObject.depth;
        sprite.texture.frame = this._makeFrameRectangle(sprite.texture, renderObject.textureSubregion);
        const time = Date.now();
        const currTexData = this._currentTextures.get(renderObject.id);
        if (currTexData !== undefined && currTexData.texture !== renderObject.texture) {
            this._textureFetcher.get(renderObject.texture)
            .then((newBaseTex) => {
                // We need to get the texture data again to check against what it is when the texture loads
                // This is so we can make sure by the time the texture loads it's still relevant
                const nextTexData = this._currentTextures.get(renderObject.id);
                if (sprite !== undefined && time > nextTexData!.time) {
                    sprite.texture.destroy();
                    sprite.texture = new PIXI.Texture(
                        newBaseTex
                    );
                    sprite.texture.frame = this._makeFrameRectangle(sprite.texture, renderObject.textureSubregion);
                    this._currentTextures.set(renderObject.id, {
                        time,
                        texture: renderObject.texture
                    });
                }
            });
        }
    }

    /**
     * Removes a render object
     *
     * @param {number} id The ID of the render object to remove
     * @memberof ScreenRendererPure
     */
    public removeRenderObject(id: string) {
        const sprite = this._sprites.get(id);
        if (sprite !== undefined) {
            sprite.destroy();
        }
        this._sprites.delete(id);
    }

    /**
     * Updates the current sprites.
     *
     * @memberof ScreenRendererPure
     */
    public update() {
        // Does nothing for now
        // Eventually will handle interpolation
    }

    public resize() {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    private _makeFrameRectangle(
            tex: PIXI.Texture,
            rect: {x: number, y: number, width: number, height: number}): PIXI.Rectangle {
        const x = this._clamp(rect.x, 0, tex.baseTexture.width);
        const y = this._clamp(rect.y, 0, tex.baseTexture.height);
        const width = this._clamp(rect.width, 0, tex.baseTexture.width - x);
        const height = this._clamp(rect.height, 0, tex.baseTexture.height - y);
        return new PIXI.Rectangle(x, y, width, height);
    }

    private _clamp(val: number, min: number, max: number) {
        return Math.min(max, Math.max(val, min));
    }
}
