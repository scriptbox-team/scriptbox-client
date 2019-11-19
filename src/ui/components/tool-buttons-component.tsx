import React from "react";
import NamedImageButtonComponent from "./named-image-button-component";

interface ToolData {
    id: string;
    name: string;
    icon: string;
}

interface ToolButtonsProperties {
    tools: ToolData[];
    selectedTool: string;
    onChange: (id: string) => void;
}

export default class ToolButtonsComponent extends React.Component<ToolButtonsProperties> {
    constructor(props: ToolButtonsProperties) {
        super(props);
        this._reportToolChange = this._reportToolChange.bind(this);
    }
    public render() {
        return <div className="tool-buttons"> {
            this.props.tools.map((tool: ToolData) => {
                return <NamedImageButtonComponent
                    id={tool.id}
                    key={tool.id}
                    image={tool.icon}
                    name={tool.name}
                    onClick={() => this._reportToolChange(tool.id)}
                />;
            })
        }</div>;
    }
    private _reportToolChange(id: string) {
        this.props.onChange(id);
    }
}
