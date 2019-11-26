import React from "react";

interface TitledWindowProperties {
    title: string;
    closeable: boolean;
    onClose: () => void;
}

export default class TitledWindowComponent extends React.Component<TitledWindowProperties> {
    public render() {
        return <div className="titled-window">
            <div className="window-titlebar">
                <span className="window-title">{this.props.title}</span>
                {(() => {
                    if (this.props.closeable) {
                        return <span className="window-close-button">
                            <button className="window-close-button" onClick={this.props.onClose}>
                                <span className="x-button">x</span>
                            </button>
                        </span>;
                    }
                })()}
            </div>
            {this.props.children}
        </div>;
    }
}
