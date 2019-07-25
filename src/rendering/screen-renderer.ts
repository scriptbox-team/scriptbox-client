import RenderObject from "./render-object";

export default abstract class ScreenRenderer {
    public abstract updateRenderObject(renderObject: RenderObject): void;
    public abstract removeRenderObject(id: number): void;
    public abstract update(): void;
}
