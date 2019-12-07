import IPConverter from "core/ip-converter";
import path from "path";
import LoginAPIInterface from "./login-api-interface";

export default class LoginAPIInterfacePure extends LoginAPIInterface {
    private _ip!: string;
    constructor() {
        super();
    }
    public setIP(ip: string) {
        this._ip = ip;
    }
    public login(username: string, password: string) {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const request = new XMLHttpRequest();
        request.open("POST", IPConverter.toHTTP(path.join(this._ip, "/login")));
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
    public signup(username: string, email: string, password: string) {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        const request = new XMLHttpRequest();
        request.open("POST", IPConverter.toHTTP(path.join(this._ip, "/signup")));
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
