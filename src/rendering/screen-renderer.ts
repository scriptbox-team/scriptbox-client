import RenderObject from "resource-management/render-object";

export default abstract class ScreenRenderer {
    public abstract updateRenderObject(resourceIP: string, renderObject: RenderObject): void;
    public abstract removeRenderObject(id: string): void;
    public abstract update(): void;
}
