import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from "@material-ui/core";
import { createNewCategory, getCategoryByName } from './api.call';
import NormalDialog from "./NormalDialog.js"
import Radio from '@material-ui/core/Radio';
import { useSelector, useDispatch } from "react-redux";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CustomBtn from "./CustomBtn.js"
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete } from '@material-ui/lab';


const useStyles = makeStyles((theme) => ({
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
        width: "430px",
        margin: "20px 0px 0px"
    },
    btnCont: {
        display: "flex",
        alignItems: "center",
        marginTop: "25px",
        justifyContent: "space-between"
    }
}));

export default function CategoryCreateDialog(props) {
    const classes = useStyles();
    const {
        openCategoryCreate, setOpenCategoryCreate, addCategoryTag
    } = props;

    const { user } = useSelector((state) => state.auth);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState("appRelated")
    const [isCreateNew, setIsCreateNew] = useState(false)
    const [categoryObj, setCategoryObj] = useState(null)
    const [categoryName, setCategoryName] = useState("")
    const [options, setOptions] = useState([])

    const handleClose = () => {
        setIsCreateNew(false)
        setOpenCategoryCreate(false)
    }

    const handleChangeRadio = (value) => {
        setType(value.target.value)
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

                addCategoryTag(data)
                handleClose()
                setName("")
                setDescription("")
                setType("appRelated")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const selectedCategory = () => {
        addCategoryTag(categoryObj)
        handleClose()
    }

    const onCategorySelected = (obj) => {
        if (obj?._id === "new") {
            setName(obj?.val)
            setIsCreateNew(true)
        } else {
            setCategoryObj(obj)
        }
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
                        val: value,
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

    return (
        <NormalDialog
            openDialog={openCategoryCreate}
            handleCloseShare={handleClose}
            pageTitle={"Add Category"}
            content={<>
                {isCreateNew ? (<>
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
                    </div>
                </>) : (<>
                    <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        value={categoryObj}
                        inputValue={categoryName}
                        options={options}
                        getOptionLabel={(option) => { return option?.name || " "; }}
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
                        style={{ width: "430px" }}
                        size="small"
                    />
                </>)}
                <div className={classes.btnCont} >
                    <div></div>
                    {isCreateNew ? (<>
                        {name.length > 2 ? (
                            <CustomBtn
                                startPart={<AddIcon />}
                                text={"Add"}
                                disabled={false}
                                onClick={createCategory}
                                style={{ padding: "6px 15px" }}
                            />
                        ) : (
                            <CustomBtn
                                startPart={<AddIcon />}
                                text={"Add"}
                                disabled={true}
                                style={{ padding: "6px 15px" }}
                            />
                        )}
                    </>) : (<>
                        {categoryObj ? (
                            <CustomBtn
                                startPart={<AddIcon />}
                                text={"Add"}
                                disabled={false}
                                onClick={selectedCategory}
                                style={{ padding: "6px 15px" }}
                            />
                        ) : (
                            <CustomBtn
                                startPart={<AddIcon />}
                                text={"Add"}
                                disabled={true}
                                style={{ padding: "6px 15px" }}
                            />
                        )}
                    </>)}
                </div>
            </>}
        />
    );
}
