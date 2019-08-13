import * as React from "react";
import ChatDisplayComponent from "./chat-display-component";
import TextEntryComponent from "./text-entry-component";

interface IChatProperties {
    messages: string[];
    chatEntryValue: string;
    onMessageEntryChange: (msg: string) => void;
    onMessageEntrySubmit: (msg: string) => void;
}

export default class ChatComponent extends React.Component<IChatProperties>{
    public render() {
        const className = "chat";
        const style = {
            bottom: 0,
            left: 0,
            height: 200,
            width: 250
        };
        return <div className={className} style={style}>
            <ChatDisplayComponent messages={this.props.messages}/>
            <TextEntryComponent
                class="chat-entry"
                value={this.props.chatEntryValue}
                onChange={this.props.onMessageEntryChange}
                onEnterKey={this.props.onMessageEntrySubmit}
            />
        </div>;
    }
}
