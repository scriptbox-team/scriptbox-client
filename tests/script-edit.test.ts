
import path from "path";
import { Application } from "spectron";

describe("script edit", () => {
    test("can clone and edit a script", () => {
        const app = new Application({
            path: path.join(__dirname, "../")
        });
    });
});
