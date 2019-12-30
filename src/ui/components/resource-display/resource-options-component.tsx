import React from "react";
import Resource from "resource-management/resource";

interface ResourceOptionsProperties {
    resource: Resource;
    onReupload: () => void;
    onDelete: () => void;
    onShareChange: (share: boolean) => void;
}

/**
 * A component for displaying the options of a component.
 *
 * @export
 * @class ResourceOptionsComponent
 * @extends {React.Component<ResourceOptionsProperties>}
 */
export default class ResourceOptionsComponent extends React.Component<ResourceOptionsProperties> {
    public render() {
        return <div className="resource-options">
            <button className="reupload-button" onClick={this._handleReupload}>Reupload</button>
            <button className="delete-button" onClick={this._handleDelete}>Delete</button>
            Share <input
                    type="checkbox"
                    checked={this.props.resource.shared}
                    onChange={(event: React.ChangeEvent<HTMLElement>) => {
                        this._onShareChange((event.target as any).checked ? true : false);
                    }}
                />
        </div>;
    }
    private _handleReupload = () => {
        this.props.onReupload();
    }
    private _handleDelete = () => {
        this.props.onDelete();
    }
    private _onShareChange(shared: boolean) {
        this.props.onShareChange(shared);
    }
}
