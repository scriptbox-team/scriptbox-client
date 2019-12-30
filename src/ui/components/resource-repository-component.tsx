
import React from "react";
import Resource from "resource-management/resource";

import SharedResourceListComponent from "./shared-resource-list-component";
import TextEntryComponent from "./text-entry-component";

interface ResourceRepositoryComponentProperties {
    resources: Resource[];
    onSearch: (search: string) => void;
    onClone: (resource: Resource) => void;
}

interface ResourceRepositoryComponentState {
    searchValue: string;
    selectedResourceID?: string;
}

/**
 * A component for displaying a single resource within the shared resource repository.
 *
 * @export
 * @class ResourceRepositoryComponent
 * @extends {React.Component<ResourceRepositoryComponentProperties, ResourceRepositoryComponentState>}
 */
export default class ResourceRepositoryComponent extends
        React.Component<ResourceRepositoryComponentProperties, ResourceRepositoryComponentState> {
    public constructor(props: ResourceRepositoryComponentProperties) {
        super(props);
        this.state = {
            searchValue: ""
        };
    }
    public render() {
        return <div className="shared-component-search">
            <div className="shared-search-bar">
                Search: <TextEntryComponent
                    class="shared-search"
                    value={this.state.searchValue}
                    onChange={(val) => {
                        this.setState({searchValue: val});
                    }}
                    onSubmit={this._onSearch}
                    submitOnEnter
                />
            </div>
            <SharedResourceListComponent
                resources={this.props.resources}
                onReupload={() => {}}
                onSoundPlay={() => {}}
                onSoundStop={() => {}}
                onScriptEdit={() => {}}
                onScriptRun={() => {}}
                onDelete={() => {}}
                onInfoChange={() => {}}
                onInfoSubmit={() => {}}
                onResourceChange={(resourceID) => {
                    this.setState({
                        selectedResourceID: resourceID
                    });
                }}
                onClone={this._onClone}
                selectedResourceID={this.state.selectedResourceID}
            />
        </div>;
    }
    private _onSearch = (search: string) => {
        this.props.onSearch(search);
    }
    private _onClone = (resource: Resource) => {
        this.props.onClone(resource);
    }
}
