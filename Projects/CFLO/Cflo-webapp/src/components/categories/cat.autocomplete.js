import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CreateBtn from "../styled/actionBtns/create.btn";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Api from "../../helpers/Api";
import { useDebounce } from 'react-use';
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column'
        },
        // border: '1px solid red'
    },

    nameInput: {
        maxWidth: "24rem",
        minWidth: "24rem",
        margin: "1rem",
        [theme.breakpoints.down('xs')]: {
            minWidth: "95%",
        },

        // display: "flex",
        // flexDirection: "row",
    },
}));

export default function CatAutocomplete(props) {
    const classes = useStyles();
    const { catIds, catDict, addCats, removeCat } = props;

    const { root, nameInput } = classes;
    const oldCats = catIds.map(catId => catDict[catId])
    const oldCatNames = oldCats.map(cat => cat?.name)
    const placeholder = [];
    const [skills, setSkills] = useState([]);
    const [options, setOptions] = useState([])
    const [text, setText] = useState('')

    const createCats = async () => {
        if (skills.length > 0) {

            const res = await Api.post("category/createMany", {
                names: skills
            });
            const data = res.data;
            if (data?.length > 0) {
                addCats(data);
            }
        }
    };

    const sendQuery = async () => {

        if (text.length > 1) {

            const res = await Api.post("category/getCats", {
                name: text
            })
            const data = res.data;
            if (data?.length > 0) {
                const names = data.map(cat => cat.name)
                setOptions(names)
            }
        }


    }

    useEffect(() => {
        setSkills([""]);
    }, []);

    useDebounce(() => {
        sendQuery();
    }, 500, [text]);

    return (
        <div className={root}>
            <div className={nameInput}>
                <Autocomplete
                    multiple
                    size="small"
                    id="tags-filled"
                    value={skills}
                    options={options.map((option) => option)}
                    freeSolo
                    onChange={(event, value, reason) => {
                        setSkills(value);
                    }}
                    onInputChange={(event, value, reason) => {
                        console.log(value, ' is the onInputChange')
                        setText(value)
                    }}
                    renderTags={(value, getTagProps) => {
                        return value.map((option, index) => {
                            return (
                                <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            );
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Unit's Name (eg 102A) then press enter  "
                        />
                    )}
                />
            </div>
            <div>
                <CreateBtn
                    onClick={() => {
                        createCats(skills);
                        setSkills([]);
                    }}
                >
                    Add
                </CreateBtn>
            </div>
        </div>
    );
}
