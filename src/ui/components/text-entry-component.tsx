import * as React from "react";

interface ITextEntryProperties {
    class: string;
    value: string;
    onChange: (newValue: string) => void;
    onEntry: (msg: string) => void;
    pretty?: boolean;
    enterOnUnfocus?: boolean;
}

export default class TextEntryComponent extends React.Component<ITextEntryProperties> {
    constructor(props: ITextEntryProperties) {
        super(props);
    }
    public render() {
        const callback = (event: React.KeyboardEvent) => {
            // TODO: Holding shift shouldn't trigger this
            // And instead put a line break
            if (event.keyCode === 13) {
                this.props.onEntry(this.props.value);
            }
        };
        return <input type="text"
            className={`text-entry ${this.props.class} ${this.props.pretty ? "pretty-text-entry" : ""}`}
            onKeyDown={callback}
            onChange={(event: React.ChangeEvent<HTMLElement>) => this.props.onChange((event.target as any).value)}
            onBlur={(event: React.FocusEvent<HTMLElement>) => {
                if (this.props.enterOnUnfocus) {
                    this.props.onEntry(this.props.value);
                }
            }}
            value={this.props.value}
        />;
    }
}
