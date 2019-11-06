import UIScreen from "./ui-screen";

export default abstract class LoginUI extends UIScreen {
    public onConnect!: (server: string) => void;
    public onLogin!: (username: string, password: string) => void;
    public onSignup!: (username: string, email: string, password: string) => void;
    public abstract setMenu(menu: string): void;
}
