import * as React from "react";
import * as ReactDOM from "react-dom";
import ChatComponent from "./components/chat-component";
import UIManager from "./ui-manager";

export default class UIManagerPure extends UIManager {
    private _messages: string[] = [];
    private _chatEntryVal: string = "";
    constructor() {
        super();
        this.playerEnteredChatMessage = this.playerEnteredChatMessage.bind(this);
    }
    public render() {
        ReactDOM.render(
            React.createElement(ChatComponent, {
                chatEntryValue: this._chatEntryVal,
                messages: this._messages,
                onMessageEntryChange: (newChatEntryVal: string) => this._chatEntryVal = newChatEntryVal,
                onMessageEntrySubmit: this.playerEnteredChatMessage
            }, null),
            document.getElementById("ui")
        );
    }
    public receiveChatMessage(message: string) {
        this._messages.push(message);
    }
    public playerEnteredChatMessage(message: string) {
        if (this.onPlayerMessageEntry !== undefined && this._chatEntryVal.length > 0) {
            this.onPlayerMessageEntry(message);
            this._chatEntryVal = "";
        }
    }
}
