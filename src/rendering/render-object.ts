export default class RenderObject {
    public id: number;
    public texture: string;
    public textureSubregion: {x: number, y: number, width: number, height: number};
    public position: {x: number, y: number};
    public depth: number;
    constructor(
        id: number,
        texture: string,
        subregion: {x: number, y: number, width: number, height: number},
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
