import fs from "fs-extra";

interface Configuration {
    loginURL: string;
}

/**
 * A configuration loader for use in the Electron app.
 * This loads the configuration from a file using fs.
 *
 * @export
 * @class ConfigurationLoaderNode
 */
export default class ConfigurationLoaderNode {
    /**
     * Load the configuration from a file.
     *
     * @param {string} path The path to load from.
     * @returns {Promise<Configuration>} The configuration loaded.
     * @memberof ConfigurationLoaderNode
     */
    public async loadConfig(path: string): Promise<Configuration> {
        return fs.readJSON(path);
    }
}
