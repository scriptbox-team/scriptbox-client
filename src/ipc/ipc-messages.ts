/**
 * An enum which defines different IPC message types.
 *
 * @enum {number}
 */
enum ipcMessages {
    KeyPress = "KeyPress",
    KeyRelease = "KeyRelease",
    MousePress = "MousePress",
    MouseRelease = "MouseRelease",
    MouseMove = "MouseMove",
    RenderObjectUpdate = "RenderObjectUpdate",
    RenderObjectDelete = "RenderObjectDelete",
    RenderUpdate = "RenderUpdate",
    UIRender = "UIRender",
    ChatMessage = "ChatMessage",
    PlayerMessageEntry = "PlayerMessageEntry",
    ToolChange = "ToolChange",
    FileUpload = "FileUpload",
    ResourceAPITokenRequest = "ResourceAPITokenRequest",
    ResourceAPIToken = "ResourceAPIToken",
    ResourceList = "ResourceList",
    ResourceDelete = "ResourceDelete",
    ResourceReupload = "ResourceReupload",
    ResourceInfoModify = "ResourceInfoModify",
    PlaySound = "PlaySound",
    StopSound = "StopSound",
    RunScript = "RunScript",
    UpdateEntityInspect = "UpdateEntityInspect",
    SetInspectEntity = "SetInspectEntity",
    DeleteComponent = "DeleteComponent",
    SetEntityControl = "SetEntityControl",
    SetComponentEnableState = "SetComponentEnableState"
}
export default ipcMessages;
