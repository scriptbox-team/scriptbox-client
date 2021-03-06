import * as React from "react";
import ChatMessageComponent from "./chat-message-component";
import ScrollableComponent from "./scrollable-component";

interface ChatDisplayProperties {
    messages: string[];
}

/**
 * A component for displaying the chat messages.
 *
 * @export
 * @class ChatDisplayComponent
 * @extends {React.Component<ChatDisplayProperties>}
 */
export default class ChatDisplayComponent extends React.Component<ChatDisplayProperties> {
    constructor(props: ChatDisplayProperties) {
        super(props);
    }
    public render() {
        const className = "chat-display";
        return <div className={className}>
            <ScrollableComponent class="chat-scroll" autoscroll={true}>
                {this.props.messages.map((message, index) => {
                    // return <div className="chat-message" key={"" + index}>{message}</div>;
                    return <ChatMessageComponent key={"" + index} message={message}/>;
                })}
            </ScrollableComponent>
        </div>;
    }
}
