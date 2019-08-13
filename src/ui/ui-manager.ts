export default abstract class UIManager {
    public onPlayerMessageEntry?: (message: string) => void;
    public abstract render(): void;
    public abstract receiveChatMessage(message: string): void;
}
