import GameUI from "./game-ui";
import LoginUI from "./login-ui";
import UIScreen from "./ui-screen";

/**
 * A manager which can manage multiple screens.
 *
 * @export
 * @class UIManager
 */
export default class UIManager {
    public loginUI: LoginUI;
    public gameUI: GameUI;
    public selectedUI: UIScreen;
    /**
     * Creates an instance of UIManager.
     * @param {LoginUI} loginUI The login UI screen
     * @param {GameUI} gameUI The game UI screen
     * @memberof UIManager
     */
    constructor(loginUI: LoginUI, gameUI: GameUI) {
        this.loginUI = loginUI;
        this.gameUI = gameUI;
        this.selectedUI = this.loginUI;
    }
    /**
     * Render the currently selected UI screen.
     *
     * @memberof UIManager
     */
    public render() {
        this.selectedUI.render();
    }
    /**
     * Change the UI screen.
     *
     * @param {string} ui The name of the UI screen to switch to.
     * @memberof UIManager
     */
    public setUI(ui: string) {
        switch (ui) {
            case "login": {
                this.selectedUI = this.loginUI;
                break;
            }
            case "game": {
                this.selectedUI = this.gameUI;
                break;
            }
        }
    }
}
