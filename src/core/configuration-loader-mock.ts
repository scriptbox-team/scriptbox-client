import fs from "fs-extra";
import ConfigurationLoader from "./configuration-loader";

interface Configuration {
    loginURL: string;
}

/**
 * A mock for the configuration loader.
 *
 * @export
 * @class ConfigurationLoaderMock
 * @extends {ConfigurationLoader}
 */
export default class ConfigurationLoaderMock extends ConfigurationLoader {
    /**
     * Load the config.
     * This just returns a default configuration.
     *
     * @param {string} path The path to load from. Not used.
     * @returns {Promise<Configuration>} The configuration.
     * @memberof ConfigurationLoaderMock
     */
    public async loadConfig(path: string): Promise<Configuration> {
        return {
            loginURL: "http://[::1]:9000/"
        };
    }
}
