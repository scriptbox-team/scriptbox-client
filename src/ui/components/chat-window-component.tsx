import * as React from "react";
import ChatDisplayComponent from "./chat-display-component";
import TextEntryComponent from "./text-entry-component";

interface ChatWindowProperties {
    messages: string[];
    chatEntryValue: string;
    onMessageEntryChange: (msg: string) => void;
    onMessageEntrySubmit: (msg: string) => void;
    setMessageEntryValue: (func: (value: string) => void) => void;
}

/**
 * A component for a full chat window, both the display and the text entry.
 *
 * @export
 * @class ChatWindowComponent
 * @extends {React.Component<ChatWindowProperties>}
 */
export default class ChatWindowComponent extends React.Component<ChatWindowProperties>{
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
                setValue={this.props.setMessageEntryValue}
            />
        </div>;
    }
}
