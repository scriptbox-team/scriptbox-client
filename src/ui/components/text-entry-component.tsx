import * as React from "react";

interface TextEntryProperties {
    class: string;
    value: string;
    onChange: (newValue: string) => void;
    onSubmit: (msg: string) => void;
    submitOnUnfocus?: boolean;
    submitOnEnter?: boolean;
    multiline?: boolean;
    pretty?: boolean;
}

export default class TextEntryComponent extends React.Component<TextEntryProperties> {
    constructor(props: TextEntryProperties) {
        super(props);
    }
    public render() {
        const callback = (event: React.KeyboardEvent) => {
            // TODO: Holding shift shouldn't trigger this
            // And instead put a line break
            if (event.keyCode === 13 && this.props.submitOnEnter) {
                this._submit();
            }
        };
        if (!this.props.multiline) {
            return <input type="text"
                className={`text-entry ${this.props.class} ${this.props.pretty ? "pretty-text-entry" : ""}`}
                onKeyDown={callback}
                onChange={(event: React.ChangeEvent<HTMLElement>) => this.props.onChange((event.target as any).value)}
                onBlur={(event: React.FocusEvent<HTMLElement>) => {
                    if (this.props.submitOnUnfocus) {
                        this._submit();
                    }
                }}
                value={this.props.value}
            />;
        }
        else {
            return <textarea
                className={`text-entry multiline ${this.props.class} ${this.props.pretty ? "pretty-text-entry" : ""}`}
                onKeyDown={callback}
                onChange={(event: React.ChangeEvent<HTMLElement>) => this.props.onChange((event.target as any).value)}
                onBlur={(event: React.FocusEvent<HTMLElement>) => {
                    if (this.props.submitOnUnfocus) {
                        this._submit();
                    }
                }}
                value={this.props.value}
            />;
        }
    }
    private _submit() {
        this.props.onSubmit(this.props.value);
    }
}
