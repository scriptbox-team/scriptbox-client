import RenderObject from "resource-management/render-object";
import Camera from "./camera";

export default abstract class ScreenRenderer {
    public reportCameraChange?: (camera: Camera) => void;
    public abstract updateRenderObject(resourceIP: string, renderObject: RenderObject): void;
    public abstract removeRenderObject(id: string): void;
    public abstract update(): void;
    public abstract updateCamera(x: number, y: number, xScale: number, yScale: number): void;
}
