import { TokenType } from "./packets/client-token-request-packet";

export default abstract class ResourceAPIInterface {
    public onTokenRequest?: (token: TokenType) => void;
    public abstract send(fileList: FileList, url: string, resourceID?: string): Promise<void>;
    public abstract delete(resourceID: string, url: string): Promise<void>;
    public abstract supplyToken(token: number, tokenType: TokenType): void;
}
