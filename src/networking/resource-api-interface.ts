import { TokenType } from "./packets/client-token-request-packet";

/**
 * An interface for interacting with the game server's resource API.
 *
 * @export
 * @abstract
 * @class ResourceAPIInterface
 */
export default abstract class ResourceAPIInterface {
    public onTokenRequest?: (token: TokenType) => void;
    /**
     * Send file(s) to the resource server.
     *
     * @abstract
     * @param {FileList} fileList A list of files to send.
     * @param {string} [resourceID] If updating a resource, the resource ID of that file.
     * @returns {Promise<void>} A promise that resolves when the file is sent.
     * @memberof ResourceAPIInterface
     */
    public abstract send(fileList: FileList, resourceID?: string): Promise<void>;
    /**
     * Delete a resource from the resource server.
     *
     * @abstract
     * @param {string} resourceID The ID of the resource to delete.
     * @returns {Promise<void>} A promise that resolves when the resource deletion request is sent.
     * @memberof ResourceAPIInterface
     */
    public abstract delete(resourceID: string): Promise<void>;
    /**
     * Supply a token to use to send a request.
     * This will attach to whatever the top queued request is.
     *
     * @abstract
     * @param {number} token The token to supply.
     * @param {TokenType} tokenType The type of the token to supply.
     * @memberof ResourceAPIInterface
     */
    public abstract supplyToken(token: number, tokenType: TokenType): void;
    /**
     * Set the IP to use for the resource server.
     *
     * @abstract
     * @param {string} url The URL of the resource server.
     * @memberof ResourceAPIInterface
     */
    public abstract setIP(url: string): void;
}
