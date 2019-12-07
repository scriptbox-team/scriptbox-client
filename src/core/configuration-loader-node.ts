import fs from "fs-extra";

interface Configuration {
    loginIP: string;
}

export default class ConfigurationLoaderNode {
    public async loadConfig(path: string): Promise<Configuration> {
        return fs.readJSON(path);
    }
}
