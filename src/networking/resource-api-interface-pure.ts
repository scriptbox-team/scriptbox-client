import { TokenType } from "./packets/client-token-request-packet";
import ResourceAPIInterface from "./resource-api-interface";

export default class ResourceAPIInterfacePure extends ResourceAPIInterface {
    private _sendResolutionQueue: Array<(value?: number | PromiseLike<number> | undefined) => void>;
    private _deleteResolutionQueue: Array<(value?: number | PromiseLike<number> | undefined) => void>;
    constructor() {
        super();
        this._sendResolutionQueue = new Array<(value?: number | PromiseLike<number> | undefined) => void>();
        this._deleteResolutionQueue = new Array<(value?: number | PromiseLike<number> | undefined) => void>();
    }
    public send(fileList: FileList, url: string, resourceID?: string) {
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
            request.open("POST", url);
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
    public delete(resourceID: string, url: string) {
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
            request.open("DELETE", url);
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
}
