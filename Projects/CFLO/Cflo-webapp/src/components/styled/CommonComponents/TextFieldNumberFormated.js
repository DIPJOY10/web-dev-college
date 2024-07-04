import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles((theme) => ({
    input: {
        backgroundColor: "#FCFCFC",
    },
}));


function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix="$"
        />
    );
}


export default function TextFieldNumberFormated(props) {
    const {
        value, onChange, variant, style, size, endAdorn = null, label = null, disabled, placeholder
    } = props;
    const classes = useStyles();

    return (
        <>{label ? (
            <TextField
                label={label}
                value={value}
                onChange={onChange}
                name="numberformat"
                placeholder={placeholder}
                id="formatted-numberformat-input"
                InputProps={endAdorn ? {
                    inputComponent: NumberFormatCustom,
                    endAdornment: <InputAdornment position="end">{endAdorn}</InputAdornment>,
                    className: classes.input
                } : {
                    inputComponent: NumberFormatCustom,
                    className: classes.input
                }}
                variant={variant}
                style={style}
                size={size}
                disabled={disabled}
            />
        ) : (
            <TextField
                value={value}
                onChange={onChange}
                name="numberformat"
                placeholder={placeholder}
                id="formatted-numberformat-input"
                InputProps={endAdorn ? {
                    inputComponent: NumberFormatCustom,
                    endAdornment: <InputAdornment position="end">{endAdorn}</InputAdornment>,
                    className: classes.input
                } : {
                    inputComponent: NumberFormatCustom,
                    className: classes.input
                }}
                variant={variant}
                style={style}
                size={size}
                disabled={disabled}
            />
        )} </>
    );
}
