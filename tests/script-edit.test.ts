import path from "path";
import { Application } from "spectron";

let app!: Application;

describe("script edit", () => {
    jest.setTimeout(600000);
    beforeEach(() => {
        app = new Application({
            path: path.join(__dirname, "..", "scriptbox-client-win32-x64", "scriptbox-client.exe"),
        });
        return app.start();
    });
    afterEach(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });
    test("can clone and edit a script", async () => {
        await app.client.waitUntilWindowLoaded();
        await app.client.setValue(".username-entry", "TestPlayer");
        await app.client.setValue(".password-entry", "superSecretPassword1");
        await app.client.click(".login-button");
        await app.client.waitForExist(".connect-window");
        await app.client.setValue(".ip-entry", "::1:7777");
        await app.client.click(".connect-button");
        await app.client.waitForExist(".chat");
        await app.client.click(".find-resources");
        await app.client.waitForExist(".shared-component-search");
        await app.client.setValue(".shared-search", "blank");
        app.client.keys("Enter");
        await app.client.waitForExist(".shared-resource-select-element");
        await app.client.click(
            "//div[@class=\'named-image-button-name shared-resource-select-element\' and contains(., \'blank\')]"
        );
        await app.client.click(".clone-button");
        await app.client.click(".shared-repository .window-close-button");
        await app.client.waitForExist(".shared-component-search", undefined, true);
        await app.client.waitForExist(
            "//div[@class=\'named-image-button-name resource-select-element\' and contains(., \'blank\')]"
        );
        await app.client.click(
            "//div[@class=\'named-image-button-name resource-select-element\' and contains(., \'blank\')]"
        );
        await app.client.waitForExist(".edit-button");
        await app.client.click(".edit-button");
        await app.client.waitForExist(".script-edit");
        await app.client.setValue("textarea.script-edit", "10 + 10\n");
        await app.client.click(".script-editor .enter-button");
        await app.client.waitForExist(".script-editor", undefined, true);
        await app.client.click(".run-button");
        await app.client.waitForExist(
            "//div[@class=\'chat-message\' and contains(., \'blank\')]"
        );
        expect(await app.client.getText("//div[@class=\'chat-message\' and contains(., \'blank\')]"))
            .toMatch(/20/);
    });
});
