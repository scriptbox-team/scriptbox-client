interface Configuration {
    loginURL: string;
}

/**
 * A loader which can load server configuration from some source.
 *
 * @export
 * @abstract
 * @class ConfigurationLoader
 */
export default abstract class ConfigurationLoader {
    /**
     * Load the server config.
     *
     * @abstract
     * @param {string} path The path to load from.
     * @returns {Promise<Configuration>} A promise which resolves to the configuration that is loaded.
     * @memberof ConfigurationLoader
     */
    public abstract async loadConfig(path: string): Promise<Configuration>;
}
