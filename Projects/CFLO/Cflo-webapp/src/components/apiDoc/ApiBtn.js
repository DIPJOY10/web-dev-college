import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import JSONPretty from 'react-json-prettify';
import { ButtonBase } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({

    selected:{

    },

    unselected:{

    }

}));

export default function ApiBtn(props) {

    const {
        data,
        activeRoute,
        onSelect
    } = props;


    const {
        name, 
        route,
        description,
        input, 
        output,
    } = data

    const classes = useStyles();

    const {
        selected, unselected
    } = classes

    return (

        <ButtonBase key={route} onClick={()=>{
            onSelect(data)
        }} className={activeRoute=='route'?selected:unselected}>
            {name}
        </ButtonBase>
    
    );
}