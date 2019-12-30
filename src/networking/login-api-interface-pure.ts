import IPConverter from "core/ip-converter";
import url from "url";
import LoginAPIInterface from "./login-api-interface";

/**
 * The browser-side implementation of the login API interface.
 * This uses HTTP to make requests to the login server.
 *
 * @export
 * @class LoginAPIInterfacePure
 * @extends {LoginAPIInterface}
 */
export default class LoginAPIInterfacePure extends LoginAPIInterface {
    private _url!: string;
    /**
     * Creates an instance of LoginAPIInterfacePure.
     * @memberof LoginAPIInterfacePure
     */
    constructor() {
        super();
    }
    /**
     * Set the URL to use for the login server.
     *
     * @param {string} newURL The URL to use for the login server.
     * @memberof LoginAPIInterfacePure
     */
    public setURL(newURL: string) {
        this._url = newURL;
    }
    /**
     * Make a login request to the login server.
     *
     * @param {string} username The username to log in with.
     * @param {string} password The password to log in with.
     * @returns {Promise<string>} A promise which resolves to the received login token.
     * @memberof LoginAPIInterfacePure
     */
    public login(username: string, password: string) {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const request = new XMLHttpRequest();
        request.open("POST", url.resolve(this._url, "/login"));
        request.onprogress = (ev: ProgressEvent) => {
            // Some sort of progress thing here?
        };
        return new Promise<string>((resolve, reject) => {
            request.onload = () => {
                if (request.status !== 200) {
                    reject(request.responseText);
                }
                else {
                    resolve(request.responseText);
                }
            };
            request.onerror = (err) => {
                reject(err);
            };
            request.send(formData);
        });
    }
    /**
     * Make a signup request to the login server.
     *
     * @param {string} username The username to sign up with.
     * @param {string} email The email to sign up with.
     * @param {string} password The password to sign up with.
     * @returns {Promise<string>} A promise which resolves to the status given from signing up.
     * @memberof LoginAPIInterfacePure
     */
    public signup(username: string, email: string, password: string) {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        const request = new XMLHttpRequest();
        request.open("POST", url.resolve(this._url, "/signup"));
        request.onprogress = (ev: ProgressEvent) => {
            // Some sort of progress thing here?
        };
        return new Promise<string>((resolve, reject) => {
            request.onload = () => {
                if (request.status !== 200) {
                    reject(request.responseText);
                }
                else {
                    resolve(request.responseText);
                }
            };
            request.onerror = (err) => {
                reject(err);
            };
            request.send(formData);
        });
    }
}
