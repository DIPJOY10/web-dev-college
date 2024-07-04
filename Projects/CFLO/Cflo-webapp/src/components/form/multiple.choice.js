import { IconButton, TextField, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import Api from '../../helpers/Api';
import { useDebounce } from 'react-use';
export default function MultipleChoice(props) {


    const {
        option, createOption, deleteOption, index, isActive, isRow
    } = props;
    const [optionText, setOptionText] = useState(option?.optionText || "");
    const [optionImage, setOptionImage] = useState(option?.optionImage || "");




    // useEffect(() => {
    //     createOption();
    // }, [option, optionText, optionImage])
    const updateOptionApi = async (optionparam) => {
        const res = await Api.post("question/option/update", optionparam);
        console.log(res);

    }
    useDebounce(
        () => {
            if (option?._id) {
                updateOptionApi({
                    _id: option?._id,
                    // question: option?.question,
                    optionText,
                    optionImage
                });
            }
        },
        100,
        [optionText, optionImage, option]
    );
    // if (!isActive) return (<Typography variant="body1" component={"p"}>{optionText ? optionText : `Option ${index + 1}`}</Typography>)
    return (
        <div style={{ width: "100%", display: 'flex', flexDirection: 'row', justifyContent: isRow ? 'center' : 'unset' }}>
            <TextField
                variant="standard"
                style={{ width: !isRow ? `80%` : '50%' }}
                placeholder={`Option ${index + 1}`}
                value={optionText}
                onChange={(e) => { setOptionText(e.target.value) }}

            />
            <IconButton
                aria-label="add"
                onClick={() => { createOption(index) }}
            >
                <AddCircleOutlineIcon />
            </IconButton>
            <IconButton
                aria-label="delete"
                onClick={() => { deleteOption(option?.question, option?._id, index) }}
            >
                <DeleteIcon />
            </IconButton>
        </div>
    )
}
