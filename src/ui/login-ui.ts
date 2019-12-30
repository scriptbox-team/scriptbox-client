import UIScreen from "./ui-screen";

/**
 * A UI used for signup, logging in, and connecting to the server.
 *
 * @export
 * @abstract
 * @class LoginUI
 * @extends {UIScreen}
 */
export default abstract class LoginUI extends UIScreen {
    public onConnect!: (server: string) => void;
    public onLogin!: (username: string, token: string) => void;
    public onLoginAttempt!: (username: string, password: string) => void;
    public onSignup!: (username: string, email: string, password: string) => void;
    /**
     * Set the login status message.
     *
     * @abstract
     * @param {string} newStatus The login status message to set.
     * @memberof LoginUI
     */
    public abstract setStatus(newStatus: string): void;
    /**
     * Set the current menu of the login UI screen.
     *
     * @abstract
     * @param {string} menu The name of the menu to switch to.
     * @memberof LoginUI
     */
    public abstract setMenu(menu: string): void;
}
