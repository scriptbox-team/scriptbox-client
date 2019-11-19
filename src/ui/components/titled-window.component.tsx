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
                <div className="window-title">{this.props.title}</div>
                {(() => {
                    if (this.props.closeable) {
                        return <div className="window-close-button">
                            <button className="window-close-button" onClick={this.props.onClose}>
                                <span className="x-button">x</span>
                            </button>
                        </div>;
                    }
                })()}
            </div>
            {this.props.children}
        </div>;
    }
}
