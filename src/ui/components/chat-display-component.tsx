import * as React from "react";
import ChatMessageComponent from "./chat-message-component";

interface IChatDisplayProperties {
    messages: string[];
}

export default class ChatDisplayComponent extends React.Component<IChatDisplayProperties> {
    public render() {
        const className = "chat-display";
        return <div className={className}>{this.props.messages.map((message, index) => {
            return <ChatMessageComponent key={"" + index} message={message}/>;
        })}</div>;
    }
}
