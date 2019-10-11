import RenderObject from "resource-management/render-object";

export default abstract class ScreenRenderer {
    public abstract updateRenderObject(renderObject: RenderObject): void;
    public abstract removeRenderObject(id: string): void;
    public abstract update(): void;
}
