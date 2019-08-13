import * as React from "react";

interface IChatMessageProperties {
    message: string;
}

export default class ChatMessageComponent extends React.Component<IChatMessageProperties>{
    public render() {
        const className = "chat-message";
        return <div className={className}>{this.props.message}<br/></div>;
    }
}
