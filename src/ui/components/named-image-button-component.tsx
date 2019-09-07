import React from "react";

interface INamedImageButtonProperties {
    id: string;
    image: string;
    name: string;
    onClick: (id: string) => void;
}

export default class NamedImageButtonComponent extends React.Component<INamedImageButtonProperties> {
    constructor(props: INamedImageButtonProperties) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    public shouldComponentUpdate(nextProps: INamedImageButtonProperties, nextState: Readonly<{}>, nextContext: any) {
        if (nextProps.id === this.props.id
        && (nextProps.image !== this.props.image
        || nextProps.name !== this.props.name
        || nextProps.onClick !== this.props.onClick)) {
            return true;
        }
        return false;
    }
    public render() {
        return <button className="named-image-button" onClick={this.onClick}>
            <div className="named-image-button-container">
                <div className="named-image-button-name">{this.props.name}</div>
                <img className="named-image-button-image" src={this.props.image} />
            </div>
        </button>;
    }
    private onClick() {
        this.props.onClick(this.props.id);
    }
}
