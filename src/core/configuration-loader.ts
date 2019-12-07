interface Configuration {
    loginIP: string;
}

export default abstract class ConfigurationLoader {
    public abstract async loadConfig(path: string): Promise<Configuration>;
}
