import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Services from '../../../Assets/services.svg';
import Product from '../../../Assets/product.svg';
import { getChartAccounts, getOfferingsRelation, updateOfferingRelation } from './utils';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import LessText from '../../styled/CommonComponents/LessText';



const columns = [
    {
        id: 'name',
        label: 'NAME',
        minWidth: 130,
        align: 'left',
    },
    {
        id: 'desc',
        label: 'Description',
        minWidth: 250,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'chartAccount',
        label: 'Category',
        minWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'own',
        label: 'Own By',
        minWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'price',
        label: 'Price',
        minWidth: 60,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'taxRate',
        label: 'Tax Rate',
        minWidth: 60,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'createdBy',
        label: 'Created By',
        minWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'type',
        label: 'Type',
        minWidth: 60,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'edit',
        label: 'Action',
        minWidth: 60,
        align: 'center',
        format: (value) => value.toLocaleString('en-US'),
    },
];



const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    container: {
        height: "calc(100vh - 148px)",
    },
    set: {
        height: '300px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    accEditCont: {
        width: '550px',
        display: 'flex',
        justifyContent: 'space-around'
    },
    EditCont1: {
        width: '45%',
    },
    textF: {
        marginTop: '20px'
    },
    editMainCont: {
        display: 'flex',
        flexDirection: 'column',
    },
    twoRowCont: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

export default function OfferingsTable(props) {
    const { walletId } = props
    const history = useHistory();
    const classes = useStyles();


    const {
        editMainCont, twoRowCont
    } = classes;


    const [allData, setAllData] = useState([])
    const [incomechartAcc, setIncomeChartAcc] = useState([])
    const [expensechartAcc, setExpenseChartAcc] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [selectedDropdown, setSelectedDropdown] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedOfferingRelation, setSelectedOfferingRelation] = useState({})
    const [selectedChartAcc, setSelectedChartAcc] = useState({});
    const [chartAcc, setChartAcc] = useState([]);
    const [chartAccText, setChartAccText] = useState("");
    const [desc, setDesc] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [vendor, setVendor] = useState("");
    const [taxRate, setTaxRate] = useState(0);
    const [price, setPrice] = useState(0);


    useEffect(() => {
        getOfferingsRelation({ walletId })
            .then((offeringRelations) => {
                setAllData(offeringRelations)
                console.log(offeringRelations)
            })
            .catch((error) => {
                console.log(error)
            })

        getChartAccounts({ walletId })
            .then((chartAccounts) => {
                let incomeChartAccounts = []
                let expenseChartAccounts = []

                chartAccounts.map((acc) => {
                    if (acc.classification === "Income") {
                        incomeChartAccounts.push(acc)
                    } else if (acc.topLevel === 'Expense') {
                        expenseChartAccounts.push(acc)
                    }
                })

                setIncomeChartAcc(incomeChartAccounts)
                setExpenseChartAcc(expenseChartAccounts)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [walletId]);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const openEditDialog = (data) => {
        console.log(data);
        setSelectedChartAcc(data?.chartAccount)
        setDesc(data?.description)
        setName(data?.name)
        setType(data?.model)
        setVendor(data?.vendor?.parent?.displayName)
        setTaxRate(data?.taxRate)
        setPrice(data?.price)
        setSelectedOfferingRelation(data)
        setOpenEdit(true);

        if (data?.doYouOwnIt === true) {
            setChartAcc(incomechartAcc)
        } else {
            setChartAcc(expensechartAcc)
        }

    };

    const closeEditDialog = () => {
        setOpenEdit(false);
    };


    const editOfferingRelation = async () => {

        await updateOfferingRelation({
            _id: selectedOfferingRelation?._id,
            name: name,
            chartAccount: selectedChartAcc?._id,
            description: desc,
            taxRate: taxRate,
            price: price,
            wallet: walletId,
            offeringId: selectedOfferingRelation?.offering?._id,
            offeringCreater: selectedOfferingRelation?.offering?.wallet
        })
            .then((data) => {

                const updatedRelation = data.updatedRelation
                const updatedOffering = data.updatedOffering

                let newAllData = []

                allData.map((offeringRelation) => {
                    if (offeringRelation._id === updatedRelation._id) {
                        let newOfferingRelation = updatedRelation
                        newOfferingRelation.chartAccount = selectedChartAcc
                        newOfferingRelation.addedBy = offeringRelation.addedBy
                        newOfferingRelation.vendor = offeringRelation.vendor

                        if (updatedOffering === null) {
                            newOfferingRelation.offering = offeringRelation.offering
                        } else {
                            newOfferingRelation.offering = updatedOffering
                        }


                        newAllData.push(newOfferingRelation)
                    } else {
                        newAllData.push(offeringRelation)
                    }
                })

                setAllData(newAllData)
                setOpenEdit(false);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onChartAccountSelected = (value) => {
        setSelectedChartAcc(value)
    }

    const getOptionLabel = (option) => {
        return option?.name || " ";
    };


    return (
        <>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table" size={'small'}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth, fontSize: "10px" }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                allData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={data._id}
                                        >
                                            <TableCell style={{ padding: "0px", paddingLeft: "10px", textAlign: "left" }} key={"customer"} >
                                                <LessText
                                                    limit={15}
                                                    string={data?.name}
                                                />
                                            </TableCell>
                                            <TableCell style={{ padding: "0px", paddingLeft: "10px", textAlign: "left" }} key={"memo"} >
                                                <LessText
                                                    limit={110}
                                                    string={data?.description}
                                                />
                                            </TableCell>
                                            <TableCell style={{ padding: "0px", paddingLeft: "10px", textAlign: "left" }} key={"dueDate"} >
                                                <LessText
                                                    limit={9}
                                                    string={data?.chartAccount?.name}
                                                />
                                            </TableCell>
                                            <TableCell style={{ padding: "0px", paddingLeft: "10px", textAlign: "left" }} key={"owner"} >
                                                {
                                                    data?.doYouOwnIt ?
                                                        (<>Mine</>) :
                                                        (<LessText
                                                            limit={9}
                                                            string={data?.vendor?.parent?.displayName || " "}
                                                        />)
                                                }
                                            </TableCell>
                                            <TableCell style={{ padding: "0px", paddingLeft: "10px", textAlign: "center" }} key={"price"} >
                                                ${data?.price}
                                            </TableCell>
                                            <TableCell style={{ padding: "0px", paddingLeft: "10px", textAlign: "center" }} key={"taxRate"} >
                                                {data?.taxRate}%
                                            </TableCell>
                                            <TableCell style={{ padding: "0px", paddingLeft: "10px", textAlign: "left" }} key={"creater"} >
                                                <LessText
                                                    limit={9}
                                                    string={data?.addedBy?.parent?.displayName}
                                                />
                                            </TableCell>
                                            <TableCell style={{ padding: "0px", textAlign: "center" }} key={"type"} >
                                                {data?.model === "Product" && <img style={{ width: "40px", height: "auto" }} src={Product} />}
                                                {data?.model === "Service" && <img style={{ width: "40px", height: "auto" }} src={Services} />}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "center" }} key={"ac"}  >
                                                <IconButton onClick={() => { openEditDialog(data) }} >
                                                    <EditIcon style={{ caursor: "pointer", color: "#3FAD5D", fontSize: "25px" }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                    component="div"
                    count={allData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog fullWidth={true} maxWidth={'sm'} open={openEdit} onClose={closeEditDialog} aria-labelledby="max-width-dialog-title" >
                <DialogTitle style={{ borderBottom: "1px solid #E1E2E5", marginBottom: "15px" }} id="form-dialog-title">Offering</DialogTitle>
                <DialogContent>
                    <div className={editMainCont} >
                        <div className={twoRowCont} >
                            <div className={classes.EditCont1} >
                                <TextField
                                    id="outlined-password-input"
                                    label="Name"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); }}
                                    size="small"
                                    style={{ marginBottom: "15px" }}
                                />
                                <div style={{ marginBottom: "15px", marginLeft: "-18px" }}>
                                    <MyAutocomplete
                                        isSmall={false}
                                        value={selectedChartAcc}
                                        text={chartAccText}
                                        setText={setChartAccText}
                                        placeholder={"Category"}
                                        results={chartAcc}
                                        getOptionLabel={getOptionLabel}
                                        onSelect={onChartAccountSelected}
                                        label={"Category"}
                                        setWidth={"94%"}
                                    />
                                </div>
                                <TextField
                                    id="outlined-password-input"
                                    label="Price"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    value={price}
                                    onChange={(e) => { setPrice(e.target.value); }}
                                    size="small"
                                    style={{ marginBottom: "15px" }}
                                />
                                <TextField
                                    id="outlined-password-input"
                                    label="Tax Rate"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    value={taxRate}
                                    onChange={(e) => { setTaxRate(e.target.value); }}
                                    size="small"
                                    style={{ marginBottom: "15px" }}
                                />
                            </div>
                            <div className={classes.EditCont1} >
                                <TextField
                                    id="outlined-password-input"
                                    label="Type"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    value={type}
                                    disabled
                                    size="small"
                                    style={{ marginBottom: "15px" }}
                                />
                                <TextField
                                    id="outlined-password-input"
                                    label="Vendor"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    value={vendor}
                                    disabled
                                    size="small"
                                    style={{ marginBottom: "15px" }}
                                />
                            </div>
                        </div>
                        <TextField
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={2}
                            variant="outlined"
                            value={desc}
                            onChange={(e) => { setDesc(e.target.value) }}
                            style={{ width: "100%" }}
                        />
                    </div>

                </DialogContent>
                <DialogActions style={{ borderTop: "1px solid #E1E2E5", marginTop: "15px" }} >
                    <Button onClick={closeEditDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={editOfferingRelation} color="primary">
                        Save and Close
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}