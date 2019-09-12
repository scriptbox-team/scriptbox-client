import * as React from "react";
import ChatDisplayComponent from "./chat-display-component";
import TextEntryComponent from "./text-entry-component";

interface IChatWindowProperties {
    messages: string[];
    chatEntryValue: string;
    onMessageEntryChange: (msg: string) => void;
    onMessageEntrySubmit: (msg: string) => void;
}

export default class ChatWindowComponent extends React.Component<IChatWindowProperties>{
    public render() {
        const className = "chat-window";
        return <div className={className}>
            <ChatDisplayComponent
                messages={this.props.messages}
            />
            <TextEntryComponent
                class="chat-entry"
                value={this.props.chatEntryValue}
                onChange={this.props.onMessageEntryChange}
                onSubmit={this.props.onMessageEntrySubmit}
                submitOnEnter
            />
        </div>;
    }
}
