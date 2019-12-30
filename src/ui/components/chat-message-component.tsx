import * as React from "react";

interface ChatMessageProperties {
    message: string;
}

/**
 * A component for a single chat message.
 *
 * @export
 * @class ChatMessageComponent
 * @extends {React.Component<ChatMessageProperties>}
 */
export default class ChatMessageComponent extends React.Component<ChatMessageProperties>{
    public shouldComponentUpdate(nextProps: ChatMessageProperties, nextState: Readonly<{}>, nextContext: any) {
        if (nextProps.message !== this.props.message) {
            return true;
        }
        return false;
    }
    public render() {
        const className = "chat-message";
        return <div className={className}>{this.props.message}<br/></div>;
    }
}
