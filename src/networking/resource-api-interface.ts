import { TokenType } from "./packets/client-token-request-packet";

export default abstract class ResourceAPIInterface {
    public onTokenRequest?: (token: TokenType) => void;
    public abstract send(fileList: FileList, resourceID?: string): Promise<void>;
    public abstract delete(resourceID: string): Promise<void>;
    public abstract supplyToken(token: number, tokenType: TokenType): void;
    public abstract setIP(url: string): void;
}
