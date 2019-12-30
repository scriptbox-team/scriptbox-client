import * as React from "react";

interface TextEntryProperties {
    class: string;
    value: string;
    onChange: (newValue: string) => void;
    onSubmit?: (msg: string) => void;
    submitOnUnfocus?: boolean;
    submitOnEnter?: boolean;
    multiline?: boolean;
    pretty?: boolean;
    hide?: boolean;
    setValue?: (func: (value: string) => void) => void;
    fix?: boolean;
    readonly?: boolean;
}

interface TextEntryState {
    value: string;
}

/**
 * A component for creating a text entry.
 * This text entry has a variety of options such as submitting when enter is hit, and when unfocused.
 *
 * @export
 * @class TextEntryComponent
 * @extends {React.Component<TextEntryProperties, TextEntryState>}
 */
export default class TextEntryComponent extends React.Component<TextEntryProperties, TextEntryState> {
    constructor(props: TextEntryProperties) {
        super(props);
        this.setValue = this.setValue.bind(this);
        if (this.props.setValue !== undefined) {
            this.props.setValue(this.setValue);
        }
        this.state = {
            value: this.props.value
        };
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
            return <input type={this.props.hide ? "password" : "text"}
                className={`text-entry ${this.props.class} ${this.props.pretty ? "pretty-text-entry" : ""}`}
                onKeyDown={callback}
                onChange={(event: React.ChangeEvent<HTMLElement>) => this._onChange(event)}
                onBlur={(event: React.FocusEvent<HTMLElement>) => {
                    if (this.props.submitOnUnfocus) {
                        this._submit();
                    }
                }}
                value={this.props.fix ? this.state.value : this.props.value}
                readOnly={this.props.readonly === true}
            />;
        }
        else {
            return <textarea
                className={`text-entry multiline ${this.props.class} ${this.props.pretty ? "pretty-text-entry" : ""}`}
                onKeyDown={callback}
                onChange={(event: React.ChangeEvent<HTMLElement>) => this._onChange(event)}
                onBlur={(event: React.FocusEvent<HTMLElement>) => {
                    if (this.props.submitOnUnfocus) {
                        this._submit();
                    }
                }}
                value={this.props.fix ? this.state.value : this.props.value}
                readOnly={this.props.readonly}
            />;
        }
    }
    public setValue(value: string) {
        this.setState({value});
    }
    private _submit() {
        if (this.props.onSubmit !== undefined) {
            this.props.onSubmit(this.props.value);
        }
    }
    private _onChange(event: React.ChangeEvent<HTMLElement>) {
        this.setState({value: (event.target as any).value});
        this.props.onChange((event.target as any).value);
    }
}
