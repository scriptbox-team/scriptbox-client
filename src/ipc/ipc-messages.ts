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
    RenderUpdate = "RenderUpdate"
}
export default ipcMessages;
