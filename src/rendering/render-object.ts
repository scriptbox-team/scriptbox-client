export default class RenderObject {
    public id: number;
    public texture: string;
    public textureSubregion: {x1: number, y1: number, x2: number, y2: number};
    public position: {x: number, y: number};
    public depth: number;
    constructor(
        id: number,
        texture: string,
        subregion: {x1: number, y1: number, x2: number, y2: number},
        position: {x: number, y: number},
        depth: number
    ) {
        this.id = id;
        this.texture = texture;
        this.textureSubregion = subregion;
        this.position = position;
        this.depth = depth;
    }
}
