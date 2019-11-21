import * as PIXI from "pixi.js";
import RenderObject from "resource-management/render-object";
import ResourceFetcher from "resource-management/resource-fetcher";

import Camera from "./camera";
import ScreenRenderer from "./screen-renderer";

interface TextureData {
    origin: string;
    time: number;
    texture?: string;
}

interface SpriteData {
    globalX: number;
    globalY: number;
    xScale: number;
    yScale: number;
    sprite: PIXI.Sprite;
}

/**
 * The implementation of the screen renderer.
 * This handles making calls to the pixi.js API to update the screen.
 *
 * @export
 * @class ScreenRendererPure
 * @extends {ScreenRenderer}
 */
export default class ScreenRendererPure extends ScreenRenderer {
    private _textureFetcher: ResourceFetcher<PIXI.BaseTexture>;
    private _spriteData: Map<string, SpriteData>;
    private _currentTextures: Map<string, TextureData>;
    private _app: PIXI.Application;
    private _camera: Camera;
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
        this._spriteData = new Map<string, SpriteData>();
        this._currentTextures = new Map<string, TextureData>();
        this._app.renderer.autoResize = true;
        this._app.renderer.backgroundColor = 0x88D2F8;
        this._textureFetcher = new ResourceFetcher("image", (res) => {
            const result = res.texture.baseTexture;
            result.scaleMode = PIXI.SCALE_MODES.NEAREST;
            return result;
        });
        this._app.stage.sortableChildren = true;
        this._camera = new Camera();
        this._camera.viewWidth = this._app.renderer.width;
        this._camera.viewHeight = this._app.renderer.height;
        this.resize();
    }
    /**
     * Updates or creates a RenderObject
     *
     * @param {RenderObject} renderObject The RenderObject to add
     * @memberof ScreenRendererPure
     */
    public updateRenderObject(resourceIP: string, renderObject: RenderObject) {
        // TODO: Allow players to delete render objects
        if (renderObject.deleted) {
            const spriteToDelete = this._spriteData.get(renderObject.id);
            if (spriteToDelete !== undefined) {
                spriteToDelete.sprite.destroy();
            }
            this._spriteData.delete(renderObject.id);
            return;
        }
        let spriteData = this._spriteData.get(renderObject.id);
        if (spriteData === undefined) {
            spriteData = {
                globalX: 0,
                globalY: 0,
                xScale: 1,
                yScale: 1,
                sprite: new PIXI.Sprite()
            };
            this._spriteData.set(renderObject.id, spriteData);
            this._app.stage.addChild(spriteData.sprite);
            this._currentTextures.set(renderObject.id, {origin: resourceIP, time: 0, texture: undefined});
        }

        spriteData.globalX = Math.round(renderObject.position.x);
        spriteData.globalY = Math.round(renderObject.position.y);
        const localVals = this._camera.transform(spriteData.globalX, spriteData.globalY);
        spriteData.sprite.x = localVals.x;
        spriteData.sprite.y = localVals.y;
        spriteData.xScale = renderObject.scale.x;
        spriteData.yScale = renderObject.scale.y;
        spriteData.sprite.zIndex = renderObject.depth;
        spriteData.sprite.scale = new PIXI.Point(
            this._camera.xScale * spriteData.xScale,
            this._camera.yScale * spriteData.yScale
        );
        spriteData.sprite.texture.frame = this._makeFrameRectangle(
            spriteData.sprite.texture,
            renderObject.textureSubregion
        );
        const time = Date.now();
        const currTexData = this._currentTextures.get(renderObject.id);
        if (currTexData !== undefined
                && currTexData.texture !== renderObject.texture
                && this._textureFetcher !== undefined) {
            this._textureFetcher.get(resourceIP, renderObject.texture)
            .then((newBaseTex) => {
                // We need to get the texture data again to check against what it is when the texture loads
                // This is so we can make sure by the time the texture loads it's still relevant
                const nextTexData = this._currentTextures.get(renderObject.id);
                if (spriteData !== undefined && time > nextTexData!.time) {
                    spriteData.sprite.texture.destroy();
                    spriteData.sprite.texture = new PIXI.Texture(
                        newBaseTex
                    );
                    spriteData.sprite.texture.frame
                        = this._makeFrameRectangle(spriteData.sprite.texture, renderObject.textureSubregion);
                    this._currentTextures.set(renderObject.id, {
                        origin: resourceIP,
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
        const spriteData = this._spriteData.get(id);
        if (spriteData !== undefined) {
            spriteData.sprite.destroy();
        }
        this._spriteData.delete(id);
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

    public updateCamera(x: number, y: number, xScale: number, yScale: number) {
        this._camera.x = Math.round(x);
        this._camera.y = Math.round(y);
        this._camera.xScale = xScale;
        this._camera.yScale = yScale;
        for (const [spriteID, spriteData] of this._spriteData) {
            const localVals = this._camera.transform(spriteData.globalX, spriteData.globalY);
            spriteData.sprite.x = localVals.x;
            spriteData.sprite.y = localVals.y;
            spriteData.sprite.scale = new PIXI.Point(
                this._camera.xScale * spriteData.xScale,
                this._camera.yScale * spriteData.yScale
            );
        }
        if (this.reportCameraChange !== undefined) {
            this.reportCameraChange(this._camera);
        }
    }

    public resize() {
        this._app.renderer.resize(window.innerWidth, window.innerHeight);
        this._camera.viewWidth = this._app.renderer.width;
        this._camera.viewHeight = this._app.renderer.height;
        if (this.reportCameraChange !== undefined) {
            this.reportCameraChange(this._camera);
        }
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
