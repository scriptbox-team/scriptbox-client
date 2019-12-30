import React from "react";
import TextEntryComponent from "./text-entry-component";

interface ScriptEditProperties {
    script: string;
    onSave: (script: string, build: boolean) => void;
    onCancel: () => void;
    onChange: (val: string) => void;
}

/**
 * A component for displaying a script editing window.
 *
 * @export
 * @class ScriptEditComponent
 * @extends {React.Component<ScriptEditProperties>}
 */
export default class ScriptEditComponent extends React.Component<ScriptEditProperties> {
    constructor(props: ScriptEditProperties) {
        super(props);
        this.state = {files: undefined};
    }
    public render() {
        return <div className="script-editor">
            <TextEntryComponent
                class="script-edit"
                value={this.props.script}
                onChange={(val) => this._onChange(val)}
                multiline
                fix
            />
            <button className="enter-button" onClick={() => this._onSave()}>Save</button>
            <button className="cancel-button" onClick={() => this._onCancel()}>Cancel</button>
        </div>;
    }
    private _onSave() {
        this.props.onSave(this.props.script, false);
    }
    private _onCancel() {
        this.props.onCancel();
    }
    private _onChange(val: string) {
        this.props.onChange(val);
    }
}
