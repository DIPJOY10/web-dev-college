import { TextField } from '@material-ui/core';
import React from 'react'

export default function LongAnswerResponse(props) {
    const { question } = props;
    const [value, setValue] = React.useState("");
    return (
        <div style={{ width: "100%" }}>
            <TextField
                variant="standard"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                label="Your Answer"
                style={{ width: "90%" }}
            />
        </div>
    )
}
