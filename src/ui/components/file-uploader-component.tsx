import React from "react";

interface FileUploaderProperties {
    onFilesUpload: (files: FileList) => void;
}

interface FileUploaderState {
    files: FileList | undefined;
}

/**
 * A component for displaying a file upload window
 *
 * @export
 * @class FileUploaderComponent
 * @extends {React.Component<FileUploaderProperties, FileUploaderState>}
 */
export default class FileUploaderComponent extends React.Component<FileUploaderProperties, FileUploaderState> {
    constructor(props: FileUploaderProperties) {
        super(props);
        this.state = {files: undefined};
    }
    public render() {
        return <div className="file-uploader">
            <input type="file" onChange={this._changeFile} multiple/>
            <button className="upload-button" onClick={this._reportFileUpload}>Upload</button>
        </div>;
    }
    private _changeFile = (event: React.ChangeEvent) => {
        const files = (event.target as any).files;
        if (files.length > 0) {
            this.setState({files});
        }
    }
    private _reportFileUpload = () => {
        const files = this.state.files;
        if (files !== undefined && files.length > 0) {
            this.props.onFilesUpload(files);
        }
    }
}
