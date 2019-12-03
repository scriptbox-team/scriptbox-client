export default abstract class LoginAPIInterface {
    public abstract login(username: string, password: string): Promise<string>;
    public abstract signup(username: string, email: string, password: string): Promise<string>;
    public abstract setIP(ip: string): void;
}
