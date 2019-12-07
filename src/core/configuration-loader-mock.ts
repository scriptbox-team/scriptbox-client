import fs from "fs-extra";

interface Configuration {
    loginIP: string;
}

export default class ConfigurationLoaderMock {
    public async loadConfig(path: string): Promise<Configuration> {
        return {
            loginIP: "::1:9000"
        };
    }
}
