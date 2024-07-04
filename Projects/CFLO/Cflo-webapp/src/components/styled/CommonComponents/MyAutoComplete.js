import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  inputPaper: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "16rem",
    borderRadius: 0,
    paddingLeft: 10,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  margin: {
    margin: "1rem",
  },

  input: {
    backgroundColor: "#9B9B9B33"
  }
}));

export default function MyAutocomplete(props) {
  const classes = useStyles();

  const {
    value,
    text,
    setText,
    placeholder,
    results,
    getOptionLabel,
    onSelect,
    onNew,
    label,
    setWidth,
    disabledBool,
    setMarginLeft,
    isSmall
  } = props;

  return (
    <>
      {disabledBool ? (
        <Autocomplete
          id={label}
          value={value}
          options={results}
          inputValue={text}
          size={"small"}
          getOptionLabel={getOptionLabel}
          getOptionSelected={(option) => {
            return option?._id == value?._id;
          }}
          style={{
            width: setWidth,
            marginLeft: setMarginLeft ? setMarginLeft : "18px",
            marginTop: "5px",
          }}
          onChange={(event, value) => {
            if (value?._id == "New") {
              onNew();
            } else {
              if (onSelect) {
                onSelect(value);
              }
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label={label} style={{ backgroundColor: "#9B9B9B33" }} placeholder={placeholder} variant="outlined" />
          )}
          onInputChange={(event, newValue) => {
            setText(newValue);
          }}
          disabled
        />
      ) : (
        <Autocomplete
          id={label}
          value={value}
          options={results}
          inputValue={text}
          size={"small"}
          getOptionLabel={getOptionLabel}
          getOptionSelected={(option) => {
            return option?._id == value?._id;
          }}
          style={{
            width: setWidth,
            marginLeft: setMarginLeft ? setMarginLeft : "18px",
            marginTop: "5px",
          }}
          onChange={(event, value) => {
            if (value?._id == "New") {
              onNew();
            } else {
              if (onSelect) {
                onSelect(value);
              }
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label={label} placeholder={placeholder} style={{ backgroundColor: "#FCFCFC" }} variant="outlined" />
          )}
          onInputChange={(event, newValue) => {
            setText(newValue);
          }}
        />
      )}
    </>
  );
}
