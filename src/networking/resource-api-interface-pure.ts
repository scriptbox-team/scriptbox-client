import IPConverter from "core/ip-converter";
import isIp from "is-ip";

import { TokenType } from "./packets/client-token-request-packet";
import ResourceAPIInterface from "./resource-api-interface";

/**
 * The browser side of the resource API interface.
 * This uses HTTP to interact with the resource API.
 *
 * @export
 * @class ResourceAPIInterfacePure
 * @extends {ResourceAPIInterface}
 */
export default class ResourceAPIInterfacePure extends ResourceAPIInterface {
    private _sendResolutionQueue: Array<(value?: number | PromiseLike<number> | undefined) => void>;
    private _deleteResolutionQueue: Array<(value?: number | PromiseLike<number> | undefined) => void>;
    private _ip!: string;
    /**
     * Creates an instance of ResourceAPIInterfacePure.
     * @memberof ResourceAPIInterfacePure
     */
    constructor() {
        super();
        this._sendResolutionQueue = new Array<(value?: number | PromiseLike<number> | undefined) => void>();
        this._deleteResolutionQueue = new Array<(value?: number | PromiseLike<number> | undefined) => void>();
    }
    /**
     * Send file(s) to the resource server.
     *
     * @param {FileList} fileList A list of files to send.
     * @param {string} [resourceID] If updating a resource, the resource ID of that file.
     * @returns {Promise<void>} A promise that resolves when the file is sent.
     * @memberof ResourceAPIInterfacePure
     */
    public send(fileList: FileList, resourceID?: string) {
        return new Promise<number>((resolve, reject) => {
            this._sendResolutionQueue.push(resolve);
            this.onTokenRequest!(TokenType.FileUpload);
        })
        .then((token: number) => {
            // TODO: Have some form of timeout
            // In case we never get a token or file never finishes uploading
            const formData = new FormData();
            for (const file of fileList) {
                formData.append("files[]", file);
            }
            formData.append("token", "" + token);
            if (resourceID !== undefined) {
                formData.append("resourceID", resourceID);
            }

            const request = new XMLHttpRequest();
            request.open("POST", IPConverter.toHTTP(this._ip));
            request.onprogress = (ev: ProgressEvent) => {
                // Some sort of progress thing here?
            };
            return new Promise<void>((resolve, reject) => {
                request.onload = () => {
                    console.log("Files successfully uploaded.");
                    resolve();
                };
                request.onerror = (err) => {
                    console.log(`Problem uploading files! ${err}`);
                    reject(err);
                };
                request.send(formData);
            });
        });
    }
    /**
     * Delete a resource from the resource server.
     *
     * @param {string} resourceID The ID of the resource to delete.
     * @returns {Promise<void>} A promise that resolves when the resource deletion request is sent.
     * @memberof ResourceAPIInterfacePure
     */
    public delete(resourceID: string) {
        return new Promise<number>((resolve, reject) => {
            this._deleteResolutionQueue.push(resolve);
            this.onTokenRequest!(TokenType.FileDelete);
        })
        .then((token: number) => {
            // TODO: Have some form of timeout
            // In case we never get a token or file never finishes uploading
            const formData = new FormData();
            formData.append("token", "" + token);
            formData.append("resourceID", resourceID);

            const request = new XMLHttpRequest();
            request.open("DELETE", IPConverter.toHTTP(this._ip));
            request.onprogress = (ev: ProgressEvent) => {
                // Some sort of progress thing here?
            };
            return new Promise<void>((resolve, reject) => {
                request.onload = () => {
                    console.log("Resource successfully deleted.");
                    resolve();
                };
                request.onerror = (err) => {
                    console.log(`Problem deleting resource! ${err}`);
                    reject(err);
                };
                request.send(formData);
            });
        });
    }
    /**
     * Supply a token to use to send a request.
     * This will attach to whatever the top queued request is.
     *
     * @param {number} token The token to supply.
     * @param {TokenType} tokenType The type of the token to supply.
     * @memberof ResourceAPIInterfacePure
     */
    public supplyToken(token: number, tokenType: TokenType) {
        let resolve: ((value?: number | PromiseLike<number> | undefined) => void) | undefined;
        if (tokenType === TokenType.FileUpload && this._sendResolutionQueue.length > 0) {
            resolve = this._sendResolutionQueue.shift();
        }
        else if (tokenType === TokenType.FileDelete && this._deleteResolutionQueue.length > 0) {
            resolve = this._deleteResolutionQueue.shift();
        }
        if (resolve !== undefined) {
            resolve!(token);
        }
    }
    /**
     * Set the IP to use for the resource server.
     *
     * @param {string} url The URL of the resource server.
     * @memberof ResourceAPIInterfacePure
     */
    public setIP(ip: string) {
        this._ip = ip;
    }
}
