import React from "react";
import TextField from "@material-ui/core/TextField";

//reusable MUI outlined TextField

export default function FormTextField({ disabled, label, val, Handler }) {
  return (
    <TextField
      disabled={disabled}
      size="small"
      // style={{ height: "7px", marginBottom: "3rem" }}
      id="outlined-basic"
      label={label}
      variant="outlined"
      value={val}
      onChange={Handler}
    />
  );
}
