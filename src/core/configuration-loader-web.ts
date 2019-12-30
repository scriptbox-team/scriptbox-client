interface Configuration {
    loginURL: string;
}

/**
 * A configuration loader for use in the web version.
 * This loads the configuration using a XHR request.
 *
 * @export
 * @class ConfigurationLoaderWeb
 */
export default class ConfigurationLoaderWeb {
    /**
     * Load the configuration from an XHR request
     *
     * @param {string} path The path to load from
     * @returns {Promise<Configuration>} A promise that resolves to the loaded configuration.
     * @memberof ConfigurationLoaderWeb
     */
    public async loadConfig(path: string): Promise<Configuration> {
        const request = new XMLHttpRequest();
        request.open("GET", path);
        return new Promise<Configuration>((resolve, reject) => {
            request.onload = () => {
                if (request.status !== 200) {
                    reject(request.responseText);
                }
                else {
                    resolve(JSON.parse(request.responseText));
                }
            };
            request.onerror = (err) => {
                reject(err);
            };
            request.send();
        });
    }
}
