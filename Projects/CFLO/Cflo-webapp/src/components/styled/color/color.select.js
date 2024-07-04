import React from 'react';
import { SketchPicker } from 'react-color';

class ColorSelect extends React.Component {

    constructor(props) {
        super(props);
    }


    handleChangeComplete = (color, event) => {
        this.props.setColor(color.hex);
    };

    render() {
        return <SketchPicker 
            color={ this.props.color }
            onChangeComplete={ this.handleChangeComplete } 
        />;
    }
}

export default ColorSelect;