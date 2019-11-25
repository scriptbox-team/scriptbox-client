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
    GameUIRender = "GameUIRender",
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
    PauseSound = "PauseSound",
    ResumeSound = "ResumeSound",
    SetVolume = "SetVolume",
    RunScript = "RunScript",
    UpdateEntityInspect = "UpdateEntityInspect",
    SetInspectEntity = "SetInspectEntity",
    DeleteComponent = "DeleteComponent",
    SetEntityControl = "SetEntityControl",
    SetComponentEnableState = "SetComponentEnableState",
    SetupResourceIP = "SetupResourceIP",
    CameraUpdate = "CameraUpdate",
    CameraChange = "RenderedObject",
    ResourceRepoList = "ResourceRepoList",
    ScriptText = "ScriptText",
    CloneResource = "CloneResource",
    EditScript = "EditScript",
    RequestEditScript = "RequestEditScript",
    SearchResourceRepo = "SearchResourceRepo",

    LoginUIRender = "LoginUIRender",
    LoginUIChangeMenu = "LoginUIChangeMenu",
    Login = "Login",
    Signup = "Signup",
    Connect = "Connect",
    SetLoginStatus = "SetLoginStatus",
    ModifyComponentMeta = "ModifyComponentMeta",
    SetupLoginIP = "SetupLoginIP",

    QueryGamepads = "QueryGamepads"
}
export default ipcMessages;
