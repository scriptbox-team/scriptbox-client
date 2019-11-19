import GameUI from "./game-ui";
import LoginUI from "./login-ui";
import UIScreen from "./ui-screen";

export default class UIManager {
    public loginUI: LoginUI;
    public gameUI: GameUI;
    public selectedUI: UIScreen;
    constructor(loginUI: LoginUI, gameUI: GameUI) {
        this.loginUI = loginUI;
        this.gameUI = gameUI;
        this.selectedUI = this.loginUI;
    }
    public render() {
        this.selectedUI.render();
    }
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
