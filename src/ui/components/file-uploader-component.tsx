import React from "react";

interface IFileUploaderProperties {
    onFilesUpload: (files: FileList) => void;
}

interface IFileUploaderState {
    files: FileList | undefined;
}

export default class FileUploaderComponent extends React.Component<IFileUploaderProperties, IFileUploaderState> {
    constructor(props: IFileUploaderProperties) {
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
