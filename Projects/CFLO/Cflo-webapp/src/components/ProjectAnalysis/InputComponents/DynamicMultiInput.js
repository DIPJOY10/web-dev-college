import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import _ from "lodash";
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { updateAnalysisReport } from "../api.call";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import RentalExpense from "../InputComponents/RentalExpense";
import RentalProjection from "../InputComponents/RentalProjection";
import PurchaseRehab from "../InputComponents/PurchaseRehab";
import Financing from "../InputComponents/Financing";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { createItem, updateAnalysisReportById, deleteItem, updateItem } from "../api.call";
import SaveIcon from '@material-ui/icons/Save';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import TextFieldNumberFormated from "../../styled/CommonComponents/TextFieldNumberFormated";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    allItemCont: {
        width: "100%",
        padding: "5px 0px",
        marginLeft: "-5px"
    },
    itemCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    labelValueCont: {
        width: "calc(100% - 140px)",
        margin: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        [theme.breakpoints.down('sm')]: {
            width: "65%",
        }
    },
    input: {
        backgroundColor: "#FCFCFC"
    },
}));

export default function DynamicMultiInput(props) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const {
        items, ItemType, itemKeyType, currentReport,
        setCurrentReport, total, setTotal, totalFieldKey,
        inputAdornment, otherTotal = null, additionalItems = []
    } = props;

    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [currentPageItems, setCurrentPageItems] = useState([]);
    const [changeState, setChangeState] = useState(false);
    const [showItemized, setShowItemized] = useState(false);

    useEffect(() => {
        setCurrentPageItems(items)
    }, [items])

    const createNewItem = async () => {
        setChangeState(true)
        const newItemObj = {
            Name: "",
            Amount: "",
            ItemType: ItemType,
        }

        let oldItems = [...currentPageItems, newItemObj]
        setCurrentPageItems(oldItems)
        setChangeState(false)
    }

    const onChangePurchaseItem = (value, idx, key) => {
        setChangeState(!changeState)
        let inputDataArr = currentPageItems;
        let editObj = {
            ...currentPageItems[idx],
            [key]: value,
        }
        inputDataArr[idx] = editObj;
        setCurrentPageItems(inputDataArr)
        setChangeState(!changeState)
    }

    const deleteItemApiHit = async (inx) => {
        let filteredItems = currentPageItems.filter((item, i) => i !== inx);
        setCurrentPageItems(filteredItems)
    }

    const saveFullData = async () => {
        let currentTotal = 0
        let validItems = []

        currentPageItems.map((item) => {
            if (item?.Name && item?.Amount > 0) {
                validItems.push(item)
                currentTotal = currentTotal + parseInt(item?.Amount)
            }
        })

        await updateAnalysisReportById({
            reportData: {
                _id: currentReport?._id,
                [itemKeyType]: validItems,
                [totalFieldKey]: currentTotal
            }
        })
            .then((data) => {
                setCurrentReport(data)
                let items = data?.[itemKeyType]
                if (items) {
                    setCurrentPageItems(items)
                }
                let newTotal = data?.[totalFieldKey]
                setTotal(newTotal)
                setShowItemized(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }



    return (
        <div className={classes.root}>
            <div className={classes.allItemCont} >
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                    {inputAdornment === "$" ? (<>
                        <TextFieldNumberFormated
                            label={"Total(Itemized Cost)"}
                            value={otherTotal ? otherTotal : total}
                            onChange={(e) => { }}
                            variant={"outlined"}
                            style={isSmall ? { width: "65%", marginLeft: "0px" } : { width: "calc(100% - 140px)", margin: "4px" }}
                            size={"small"}
                            disabled={true}
                        />
                    </>) : (<>{inputAdornment === "$/Month" ? (<>
                        <TextFieldNumberFormated
                            label={"Total(Itemized Cost)"}
                            value={otherTotal ? otherTotal : total}
                            onChange={(e) => { }}
                            endAdorn={"Per Month"}
                            variant={"outlined"}
                            style={isSmall ? { width: "65%", marginLeft: "0px" } : { width: "calc(100% - 140px)", margin: "4px" }}
                            size={"small"}
                            disabled={true}
                        />
                    </>) : (<>
                        <TextField
                            type="number"
                            label={"Total(Itemized Cost)"}
                            id="outlined-start-adornment"
                            value={otherTotal ? otherTotal : total}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">{inputAdornment}</InputAdornment>,
                                className: classes.input
                            }}
                            variant="outlined"
                            style={isSmall ? { width: "65%", marginLeft: "0px" } : { width: "calc(100% - 140px)", margin: "4px" }}
                            size="small"
                        />
                    </>)}</>)}
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ paddingTop: "8px", paddingBottom: "8px" }}
                        startIcon={!showItemized ? <AddIcon /> : <CloseIcon />}
                        onClick={() => { setShowItemized(!showItemized) }}
                    >
                        {showItemized ? (<>Hide</>) : (<>Itemize</>)}
                    </Button>
                </div>
                {showItemized ? (<>
                    <>
                        {additionalItems.length > 0 && additionalItems.map((item, i) => (
                            <div className={classes.itemCont} >
                                {inputAdornment === "$" ? (
                                    <div className={classes.labelValueCont} >
                                        <TextField
                                            label={"Item"}
                                            id="outlined-start-adornment"
                                            value={item?.Name}
                                            variant="outlined"
                                            style={{ width: "55%" }}
                                            size="small"
                                            InputProps={{ className: classes.input }}
                                            disabled={true}
                                        />
                                        <TextFieldNumberFormated
                                            label={"Amount"}
                                            value={item?.Amount}
                                            variant={"outlined"}
                                            style={{ width: "40%" }}
                                            size={"small"}
                                            onChange={(e) => { }}
                                            disabled={true}
                                        />
                                    </div>
                                ) : (<>{inputAdornment === "$/Month" ? (
                                    <div className={classes.labelValueCont} >
                                        <TextField
                                            label={"Item"}
                                            id="outlined-start-adornment"
                                            value={item?.Name}
                                            variant="outlined"
                                            InputProps={{ className: classes.input }}
                                            style={{ width: "55%" }}
                                            size="small"
                                            disabled={true}
                                        />
                                        <TextFieldNumberFormated
                                            label={"Amount"}
                                            value={item?.Amount}
                                            endAdorn={"Per Month"}
                                            variant={"outlined"}
                                            style={{ width: "40%" }}
                                            size={"small"}
                                            onChange={(e) => { }}
                                            disabled={true}
                                        />
                                    </div>
                                ) : (
                                    <div className={classes.labelValueCont} >
                                        <TextField
                                            label={"Item"}
                                            id="outlined-start-adornment"
                                            value={item?.Name}
                                            InputProps={{ className: classes.input }}
                                            variant="outlined"
                                            style={{ width: "55%" }}
                                            size="small"
                                            disabled={true}
                                        />
                                        <TextField
                                            label={"Amount"}
                                            type="number"
                                            id="outlined-start-adornment"
                                            value={item?.Amount}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">{inputAdornment}</InputAdornment>,
                                                className: classes.input
                                            }}
                                            variant="outlined"
                                            style={{ width: "40%" }}
                                            size="small"
                                            disabled={true}
                                        />
                                    </div>
                                )}</>)}
                                <IconButton disabled >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                    </>
                    <>
                        {currentPageItems.length > 0 && currentPageItems.map((item, i) => (
                            <div className={classes.itemCont} >
                                {inputAdornment === "$" ? (
                                    <div className={classes.labelValueCont} >
                                        <TextField
                                            label={"Item"}
                                            id="outlined-start-adornment"
                                            value={item?.Name}
                                            onChange={(e) => { onChangePurchaseItem(e.target.value, i, "Name") }}
                                            variant="outlined"
                                            InputProps={{ className: classes.input }}
                                            style={{ width: "55%" }}
                                            size="small"
                                        />
                                        <TextFieldNumberFormated
                                            label={"Amount"}
                                            value={item?.Amount}
                                            onChange={(e) => { onChangePurchaseItem(e.target.value, i, "Amount") }}
                                            variant={"outlined"}
                                            style={{ width: "40%" }}
                                            size={"small"}
                                            disabled={false}
                                        />
                                    </div>
                                ) : (<>{inputAdornment === "$/Month" ? (
                                    <div className={classes.labelValueCont} >
                                        <TextField
                                            label={"Item"}
                                            id="outlined-start-adornment"
                                            value={item?.Name}
                                            InputProps={{ className: classes.input }}
                                            onChange={(e) => { onChangePurchaseItem(e.target.value, i, "Name") }}
                                            variant="outlined"
                                            style={{ width: "55%" }}
                                            size="small"
                                        />
                                        <TextFieldNumberFormated
                                            label={"Amount"}
                                            value={item?.Amount}
                                            onChange={(e) => { onChangePurchaseItem(e.target.value, i, "Amount") }}
                                            endAdorn={"Per Month"}
                                            variant={"outlined"}
                                            style={{ width: "40%" }}
                                            size={"small"}
                                            disabled={false}
                                        />
                                    </div>
                                ) : (
                                    <div className={classes.labelValueCont} >
                                        <TextField
                                            label={"Item"}
                                            id="outlined-start-adornment"
                                            value={item?.Name}
                                            onChange={(e) => { onChangePurchaseItem(e.target.value, i, "Name") }}
                                            InputProps={{ className: classes.input }}
                                            variant="outlined"
                                            style={{ width: "55%" }}
                                            size="small"
                                        />
                                        <TextField
                                            label={"Amount"}
                                            type="number"
                                            id="outlined-start-adornment"
                                            value={item?.Amount}
                                            onChange={(e) => { onChangePurchaseItem(e.target.value, i, "Amount") }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">{inputAdornment}</InputAdornment>,
                                                className: classes.input
                                            }}
                                            variant="outlined"
                                            style={{ width: "40%" }}
                                            size="small"
                                        />
                                    </div>
                                )}</>)}
                                <IconButton
                                    onClick={() => { deleteItemApiHit(i) }} >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                    </>
                    <div className={classes.itemCont} style={{ marginTop: "15px", marginBottom: "10px" }} >
                        <div></div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SaveIcon />}
                                onClick={() => { saveFullData() }}
                                style={{ padding: "6px 10px" }}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => { createNewItem() }}
                                style={{ marginLeft: "15px", padding: "6px 10px" }}
                            >
                                Add Item
                            </Button>
                        </div>
                    </div>
                </>) : (<></>)}
            </div>
        </div>
    );
}
