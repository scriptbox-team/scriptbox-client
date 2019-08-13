/**
 * An enum which defines different IPC message types.
 *
 * @enum {number}
 */
enum ipcMessages {
    KeyPress = "KeyPress",
    KeyRelease = "KeyRelease",
    RenderObjectUpdate = "RenderObjectUpdate",
    RenderObjectDelete = "RenderObjectDelete",
    RenderUpdate = "RenderUpdate",
    UIRender = "UIRender",
    ChatMessage = "ChatMessage",
    PlayerMessageEntry = "PlayerMessageEntry"
}
export default ipcMessages;
