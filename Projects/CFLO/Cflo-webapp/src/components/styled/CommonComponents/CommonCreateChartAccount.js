import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import SmsFailedIcon from '@material-ui/icons/SmsFailed';
import CloseIcon from '@material-ui/icons/Close';
import MyAutocomplete from './MyAutoComplete';
import { getChartAccountTypes, getChartAccounts, createChartAccount } from '../../finance/chartaccount/api';



const useStyles = makeStyles((theme) => ({
    mainCont: {
        width: "600px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-around",
        [theme.breakpoints.down('md')]: {
            width: '100%',
            flexDirection: 'column',
        }
    },
    subMainCont: {

    },
    btnCont: {
        borderTop: "1px solid #50AFEF",
        justifyContent: "space-between",
        marginLeft: "20px",
        marginRight: "20px",
        [theme.breakpoints.down('md')]: {
            marginLeft: "5px",
            marginRight: "5px",
        }
    },
    titleCont: {
        borderBottom: "1px solid #50AFEF"
    },
    errorMsg: {
        border: "1px solid red",
        margin: "15px",
        padding: "15px",
        position: "relative",
    },
    errHeader: {
        fontWeight: "550"
    },
    errHederCont: {
        display: "flex",
        alignItems: "center",
        color: "red",
    },
    errCloseBtn: {
        position: "absolute",
        top: "2px",
        right: "2px",
        cursor: "pointer"
    }
}));

export default function CommonChartAccountCreate(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();


    const { mainCont, subMainCont, btnCont, titleCont, errorMsg, errHeader, errHederCont, errCloseBtn } = classes
    const {
        walletId, openDialog,
        setOpenChart, onNewChartAccountCreate,
        classifications, setClassifications,
        subTypes, setSubTypes,
        topLevelCategories, setTopLevelCategories,
        categories, setCategories,
        subCategories, setSubCategories,
        chartAccounts, setChartAccounts,
        filteredChartAccounts, setFilteredChartAccounts,
        selectedChartAccount, setSelectedChartAccount,
        topLevelCategoryValue, setTopLevelCategoryValue,
        categoryValue, setCategoryValue, subCategoryDisabled,
        subCategoryValue, setSubCategoryValue,
        topLevelCategoryDisabled, categoryDisabled,
    } = props;


    const [openChartAcc, setOpenChartAcc] = useState(false)

    const [topLevelCategoryText, setTopLevelCategoryText] = useState("")
    const [categoryText, setCategoryText] = useState("")
    const [subCategoryText, setSubCategoryText] = useState("")
    const [chartAccountText, setChartAccountText] = useState("")

    const [accName, setAccName] = useState("")
    const [desc, setDesc] = useState("")
    const [initAmount, setInitAmount] = useState(0)

    const [checked, setChecked] = useState(false)
    const [err, setErr] = useState(null)



    const handleCloseChartAccount = () => {
        setOpenChartAcc(false);
        setOpenChart(false)
    };

    const handleCheck = () => {
        setChecked(!checked)
    }

    useEffect(() => {
        setOpenChartAcc(openDialog);
    }, [
        walletId,
        openDialog
    ])

    const getOptionLabelSimple = (option) => {
        return option || " ";
    };

    const getOptionLabel = (option) => {
        return option?.name || " ";
    };

    const selectTopLevelCategory = (option) => {
        console.log(option);
        if (option) {
            setTopLevelCategoryValue(option)

            const newCategoryArr = classifications?.group?.[option]
            const newCategoryVal = newCategoryArr[0]

            setCategories(newCategoryArr)
            setCategoryValue(newCategoryVal)
            let filteredAccs = []
            chartAccounts.map((acc) => {
                if (acc?.classification === newCategoryVal) {
                    filteredAccs.push(acc);
                }
            })

            setFilteredChartAccounts(filteredAccs)
            setSelectedChartAccount(filteredAccs[0])

            const newSubCategoryArr = subTypes?.[newCategoryVal]
            const newSubCategoryVal = newSubCategoryArr[0]

            setSubCategories(newSubCategoryArr)
            setSubCategoryValue(newSubCategoryVal)
        }
    }



    const selectCategory = (option) => {
        console.log(option);
        if (option) {
            setCategoryValue(option)
            let filteredAccs = []
            chartAccounts.map((acc) => {
                if (acc?.classification === option) {
                    filteredAccs.push(acc);
                }
            })

            setFilteredChartAccounts(filteredAccs)
            setSelectedChartAccount(filteredAccs[0])

            const newSubCategoryArr = subTypes?.[option]
            const newSubCategoryVal = newSubCategoryArr[0]

            setSubCategories(newSubCategoryArr)
            setSubCategoryValue(newSubCategoryVal)
        }
    }

    const selectSubCategory = (option) => {
        setSubCategoryValue(option)
    }

    const selectParentAccount = (option) => {
        setSelectedChartAccount(option)
    }


    const onClickCreateChartAccount = async () => {
        const chartAccountObj = {
            balance: initAmount,
            name: accName,
            description: desc,
            wallet: walletId,
            isSubAccount: checked,
            topLevel: topLevelCategoryValue,
            classification: categoryValue,
            qbType: subCategoryValue?.qbType,
            qbName: subCategoryValue?.name,
            debit: subCategoryValue?.debit
        }

        if (accName?.length > 2) {

            if (checked) {
                if (selectedChartAccount?.classification === categoryValue) {
                    const withParentChartAcc = {
                        ...chartAccountObj,
                        parent: selectedChartAccount?._id,
                        ancestors: [selectedChartAccount?._id]
                    }
                    console.log(withParentChartAcc)
                    await createChartAccount(withParentChartAcc)
                        .then((data) => {
                            const getStatus = data?.status
                            const resData = data?.data

                            if (getStatus === 200) {
                                console.log(resData)
                                handleCloseChartAccount()
                                onNewChartAccountCreate(resData)

                            } else {
                                if (getStatus === 401) {
                                    console.log(resData)
                                    setErr(resData)
                                }
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    setErr("For subaccounts, you must select the same account type as their parent.")
                    return;
                }
            } else {
                console.log(chartAccountObj)
                await createChartAccount(chartAccountObj)
                    .then((data) => {
                        const getStatus = data?.status
                        const resData = data?.data

                        if (getStatus === 200) {
                            console.log(resData)
                            handleCloseChartAccount()
                            onNewChartAccountCreate(resData)

                        } else {
                            if (getStatus === 401) {
                                console.log(resData)
                                setErr(resData)
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
    }

    return (
        <>
            <Dialog
                onClose={handleCloseChartAccount}
                aria-labelledby="simple-dialog-title"
                open={openChartAcc}
            >
                <DialogTitle id="alert-dialog-title" className={titleCont} >
                    Create Chart Account
                </DialogTitle>
                {err &&
                    <div className={errorMsg} >
                        <div className={errHederCont} >
                            <SmsFailedIcon />
                            <Typography className={errHeader} >Something’s not quite right</Typography>
                            <CloseIcon onClick={() => { setErr(null) }} className={errCloseBtn} />
                        </div>
                        <Typography style={{ fontSize: "14px", opacity: "0.6" }}>{err}</Typography>
                    </div>
                }
                <div className={mainCont} >
                    <div className={subMainCont} >
                        <div style={{ marginBottom: "20px" }} >
                            <MyAutocomplete
                                isSmall={false}
                                value={topLevelCategoryValue}
                                placeholder={'Select Category'}
                                results={topLevelCategories}
                                getOptionLabel={getOptionLabelSimple}
                                label={"Category"}
                                setWidth={"250px"}
                                text={topLevelCategoryText}
                                setText={setTopLevelCategoryText}
                                onSelect={selectTopLevelCategory}
                                // disabledBool={topLevelCategoryDisabled}
                                disabledBool={false}
                            />
                        </div>
                        <div style={{ marginBottom: "20px" }} >
                            <MyAutocomplete
                                isSmall={false}
                                value={categoryValue}
                                placeholder={'Select Account Type'}
                                results={categories}
                                getOptionLabel={getOptionLabelSimple}
                                label={"Account Type"}
                                setWidth={"250px"}
                                text={categoryText}
                                setText={setCategoryText}
                                onSelect={selectCategory}
                                disabledBool={false}
                            // disabledBool={categoryDisabled}
                            />
                        </div>
                        <div style={{ marginBottom: "20px" }} >
                            <MyAutocomplete
                                isSmall={false}
                                value={subCategoryValue}
                                placeholder={'Select Detail Type'}
                                results={subCategories}
                                getOptionLabel={getOptionLabel}
                                label={'Detail Type'}
                                setWidth={"250px"}
                                text={subCategoryText}
                                setText={setSubCategoryText}
                                onSelect={selectSubCategory}
                                disabledBool={false}
                            // disabledBool={subCategoryDisabled}
                            />
                        </div>
                        <div style={{ width: "250px", marginBottom: "20px", marginLeft: "18px", padding: "10px", backgroundColor: "#ECEEF1" }} >
                            <Typography style={{ fontSize: "14px" }} >
                                Use a <b>Cash on hand</b> account to track cash your
                                company keeps for occasional expenses,
                                also called petty cash.
                            </Typography>
                            <Typography style={{ fontSize: "14px" }} >
                                To track cash from sales that have not been deposited yet,
                                use a pre-created account called <b>Undeposited funds</b>, instead.
                            </Typography>
                        </div>
                    </div>
                    <div className={subMainCont} >
                        <TextField
                            required
                            id="outlined-required"
                            label="Name"
                            variant="outlined"
                            value={accName}
                            onChange={(event) => { setAccName(event.target.value) }}
                            size="small"
                            style={{ marginLeft: "18px", marginBottom: "20px", marginTop: "5px" }}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Description"
                            variant="outlined"
                            value={desc}
                            onChange={(event) => { setDesc(event.target.value) }}
                            size="small"
                            style={{ marginLeft: "18px", marginBottom: "20px" }}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Initial Balance"
                            variant="outlined"
                            type="number"
                            value={initAmount}
                            onChange={(event) => { setInitAmount(event.target.value) }}
                            size="small"
                            style={{ marginLeft: "18px", marginBottom: "20px" }}
                        />
                        <div style={{ marginLeft: "18px" }}>
                            <Checkbox
                                checked={checked}
                                onChange={handleCheck}
                                color="primary"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            Is Sub Account
                        </div>
                        <MyAutocomplete
                            isSmall={false}
                            value={selectedChartAccount}
                            placeholder={'Parent Account'}
                            results={filteredChartAccounts}
                            getOptionLabel={getOptionLabel}
                            label={'Parent Account'}
                            setWidth={"250px"}
                            text={chartAccountText}
                            setText={setChartAccountText}
                            onSelect={selectParentAccount}
                            disabledBool={!checked}
                        />
                    </div>
                </div>
                <DialogActions className={btnCont} >
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={handleCloseChartAccount}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        onClick={onClickCreateChartAccount}
                    >
                        Save and Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
