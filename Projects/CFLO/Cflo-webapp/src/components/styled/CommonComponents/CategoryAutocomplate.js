import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from "@material-ui/core";
import { createNewCategory, getCategoryByName } from './api.call';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NormalDialog from "./NormalDialog.js"
import Radio from '@material-ui/core/Radio';
import { useSelector, useDispatch } from "react-redux";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CustomBtn from "./CustomBtn.js"
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
    optionToBar: {
        display: "flex",
        paddingLeft: "10px",
        paddingRight: "10px",
        justifyContent: 'space-between',
    },
    optionCont: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    radiolabel: {
        fontSize: "14px",
        fontWeight: "500",
    },
    createCont: {
        margin: "20px 0px"
    },
    btnCont: {
        display: "flex",
        alignItems: "center",
        marginTop: "25px",
        justifyContent: "space-between"
    },
    categoriesCont: {
        display: "flex",
        flexWrap: "wrap",
        "& div": {
            marginRight: "10px",
            borderRadius: "12px",
            padding: "4px 8px",
            border: '1px solid gray',
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
        }
    }
}));

export default function CategoryAutocomplete(props) {
    const classes = useStyles();
    const {
        setCategories, categories
    } = props;

    const { user } = useSelector((state) => state.auth);
    const [openCreate, setOpenCreate] = useState(false)
    const [options, setOptions] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState("appRelated")
    const [categoryObj, setCategoryObj] = useState(null)
    const [categoryName, setCategoryName] = useState("")

    const handleClose = () => {
        setOpenCreate(false)
    }

    const handleChangeRadio = (value) => {
        setType(value.target.value)
    }

    const getOptionLabel = (option) => {
        return option?.name || " ";
    };

    const onCategorySelected = (value) => {
        if (value?._id === "new") {
            setName(categoryName)
            setOpenCreate(true)
        } else {
            let updatedCategories = [...categories, value]
            setCategories(updatedCategories)
            setCategoryObj(null)
            setCategoryName("")
        }
    }

    const createCategory = async () => {
        await createNewCategory({
            name,
            type,
            description,
            addedBy: user?.profile
        })
            .then((data) => {
                console.log(data)
                let updatedCategories = [...categories, data]
                setCategories(updatedCategories)
                setCategoryObj(null)
                setCategoryName("")
                setOpenCreate(false)
                setOptions([])
                setName("")
                setDescription("")
                setType("appRelated")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onCategoryName = async (value) => {
        if (value && value.length > 1 && !value.includes("+ Add")) {
            await getCategoryByName({
                name: value
            })
                .then((categories) => {
                    console.log(categories)
                    let addText = `+ Add ${value}`
                    const obj = {
                        name: addText,
                        _id: "new"
                    }

                    let updatedOptions = [obj, ...categories]
                    setOptions(updatedOptions)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        const getData = setTimeout(() => {
            onCategoryName(categoryName)
        }, 1000)

        return () => clearTimeout(getData)
    }, [categoryName])

    const getFirst200 = (str) => {
        let newDis = ""
        if (str) {
            if (str.length > 150) {
                newDis = str.substr(0, 150) + '...'
            } else {
                newDis = str
            }
        }
        return newDis
    }

    const removeCategory = (id) => {
        const updatedCategories = categories.filter((cat) => id !== cat._id);
        setCategories(updatedCategories)
    }


    return (<>
        {categories.length > 0 && (
            <div className={classes.categoriesCont} >
                {categories && categories.length > 0 && categories.map((cat) => (
                    <div>
                        <p>{cat?.name}</p>
                        <CloseIcon
                            style={{
                                marginLeft: "7px",
                                cursor: "pointer",
                                fontSize: "19px"
                            }}
                            onClick={() => { removeCategory(cat?._id) }}
                        />
                    </div>
                ))}
            </div>
        )}
        <Autocomplete
            id="free-solo-demo"
            freeSolo
            value={categoryObj}
            inputValue={categoryName}
            options={options}
            getOptionLabel={getOptionLabel}
            getOptionSelected={(option) => {
                return option?._id == categoryObj?._id;
            }}
            onChange={(event, value) => {
                onCategorySelected(value)
            }}
            renderInput={(params) => (
                <TextField {...params} style={{ margin: "0px" }} margin="normal" variant="outlined" placeholder={"Enter Category Name"} />
            )}
            onInputChange={(event, newValue) => {
                setCategoryName(newValue);
            }}
            renderOption={(option, state) => {
                if (option) {
                    return (
                        <div style={{ width: "100%" }} >
                            <div className={classes.optionToBar} >
                                <div>
                                    {option?.name}
                                </div>
                            </div>
                            <div style={{
                                width: "100%",
                                fontSize: '13px',
                                opacity: '0.6',
                                textAlign: 'center',
                            }} >{getFirst200(option?.description)}</div>
                        </div>
                    )
                }
                else {
                    return null;
                }
            }}
            style={{ width: "100%" }}
            size="small"
        />
        <NormalDialog
            openDialog={openCreate}
            handleCloseShare={handleClose}
            pageTitle={"Create Category"}
            content={<>
                <div className={classes.createCont} >
                    <h4>Name</h4>
                    <TextField
                        size={"small"}
                        placeholder={"Enter Name"}
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                </div>

                <div className={classes.createCont} >
                    <h4>Description</h4>
                    <TextField
                        size={"small"}
                        placeholder={"Enter Name"}
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        style={{ width: "100%" }}
                        variant="outlined"
                    />
                </div>

                <div className={classes.createCont} >
                    <h4>Type</h4>
                    <FormControl
                        component="fieldset"
                    >
                        <RadioGroup
                            className={classes.optionCont}
                            aria-label="gender"
                            name="gender1"
                            value={type}
                            onChange={handleChangeRadio}
                        >
                            <FormControlLabel
                                value="skill"
                                control={<Radio color="primary" />}
                                label={<p className={classes.radiolabel} >Skill</p>}
                            />
                            <FormControlLabel
                                value="assetType"
                                control={<Radio color="primary" />}
                                label={<p className={classes.radiolabel} >Asset Type</p>}
                            />
                            <FormControlLabel
                                value="appRelated"
                                control={<Radio color="primary" />}
                                label={<p className={classes.radiolabel} >App Related</p>}
                            />
                            <FormControlLabel
                                value="other"
                                control={<Radio color="primary" />}
                                label={<p className={classes.radiolabel} >Other</p>}
                            />
                        </RadioGroup>
                    </FormControl>

                    <div className={classes.btnCont} >
                        <div></div>
                        {name.length > 2 && description.length > 2 ? (
                            <CustomBtn
                                startPart={<AddIcon />}
                                text={"Add"}
                                disabled={false}
                                onClick={createCategory}
                            />
                        ) : (
                            <CustomBtn
                                startPart={<AddIcon />}
                                text={"Add"}
                                disabled={true}
                                onClick={createCategory}
                            />
                        )}
                    </div>
                </div>
            </>}
        />
    </>);
}
