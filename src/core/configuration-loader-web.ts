interface Configuration {
    loginIP: string;
}

export default class ConfigurationLoaderWeb {
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
