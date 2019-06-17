import * as PIXI from "pixi.js";
import RenderObject from "./render-object";
import ScreenRenderer from "./screen-renderer";
import TextureFetcher from "./texture-fetcher";

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
    private _sprites: Map<number, PIXI.Sprite>;
    private _currentTextures: Map<number, PIXI.Texture>;
    private _app: PIXI.Application;
    /**
     * Creates an instance of ScreenRendererPure.
     * @memberof ScreenRendererPure
     */
    constructor(width: number, height: number) {
        super();
        this._app = new PIXI.Application({
            width,
            height,
            antialias: false,
            transparent: false,
            resolution: 1
        });
        document.body.appendChild(this._app.view);
        this._sprites = new Map<number, PIXI.Sprite>();
        this._currentTextures = new Map<number, PIXI.Texture>();
        this._app.renderer.autoResize = true;
        this._textureFetcher = new TextureFetcher(".");
    }
    /**
     * Updates or creates a RenderObject
     *
     * @param {RenderObject} renderObject The RenderObject to add
     * @memberof ScreenRendererPure
     */
    public updateRenderObject(renderObject: RenderObject) {
        let sprite = this._sprites.get(renderObject.id);
        if (sprite === undefined) {
            sprite = new PIXI.Sprite();
            this._sprites.set(renderObject.id, sprite);
            this._app.stage.addChild(sprite);
        }

        sprite.x = renderObject.position.x;
        sprite.y = renderObject.position.y;
        sprite.zIndex = renderObject.depth;
        if (this._currentTextures.get(renderObject.id) !== sprite.texture) {
            this._textureFetcher.get(renderObject.texture)
            .then((newBaseTex) => {
                if (sprite !== undefined) {
                    sprite.texture.destroy();
                    sprite.texture = new PIXI.Texture(
                        newBaseTex,
                        new PIXI.Rectangle(
                            renderObject.textureSubregion.x1,
                            renderObject.textureSubregion.y1,
                            renderObject.textureSubregion.x2 - renderObject.textureSubregion.x1,
                            renderObject.textureSubregion.y2 - renderObject.textureSubregion.y1
                        )
                    );
                    this._currentTextures.set(renderObject.id, sprite.texture);
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
    public removeRenderObject(id: number) {
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
}
