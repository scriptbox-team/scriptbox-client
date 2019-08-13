import * as React from "react";

interface ITextEntryProperties {
    class: string;
    value: string;
    onChange: (newValue: string) => void;
    onEnterKey: (msg: string) => void;
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
                this.props.onEnterKey(this.props.value);
            }
        };
        return <input type="text"
            className={this.props.class}
            onKeyDown={callback}
            onChange={(event: React.ChangeEvent<HTMLElement>) => this.props.onChange((event.target as any).value)}
            value={this.props.value}
        />;
    }
}
