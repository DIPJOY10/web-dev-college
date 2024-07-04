import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { getChartAccountTypes, getChartAccounts, createChartAccount } from './api';
import CommonChartAccountCreate from '../../styled/CommonComponents/CommonCreateChartAccount';


const useStyles = makeStyles({

});

export default function ChartAccountCreate(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { walletId, openDialog, setOpenChart } = props;


    const [classifications, setClassifications] = useState({})
    const [subTypes, setSubTypes] = useState({})
    const [topLevelCategories, setTopLevelCategories] = useState([])
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [chartAccounts, setChartAccounts] = useState([])
    const [filteredChartAccounts, setFilteredChartAccounts] = useState([])
    const [selectedChartAccount, setSelectedChartAccount] = useState({})
    const [topLevelCategoryValue, setTopLevelCategoryValue] = useState("")
    const [categoryValue, setCategoryValue] = useState("")
    const [subCategoryValue, setSubCategoryValue] = useState({})


    useEffect(() => {
        if (openDialog) {
            getChartAccountTypes()
                .then((types) => {
                    setClassifications(types?.classifications)
                    setSubTypes(types?.subTypes)
                    const category = "Account Receivable (A/R)"

                    //options
                    setTopLevelCategories(types?.classifications?.categories)
                    setCategories(types?.classifications?.group?.Asset)


                    //selected values
                    setSubCategories(types?.subTypes?.[category])
                    setTopLevelCategoryValue("Asset")
                    setCategoryValue(category)
                    setSubCategoryValue({
                        debit: true,
                        description: "Accounts receivable (also called A/R, Debtors, or Trade and other receivables) tracks money that customers owe you for products or services, and payments customers make. \n ",
                        name: "Accounts Receivable (A/R)",
                        qbType: "AccountsReceivable"
                    })
                })


            getChartAccounts(walletId)
                .then((accs) => {
                    let filteredAccs = []
                    accs.map((acc) => {
                        if (acc?.classification === "Account Receivable (A/R)") {
                            filteredAccs.push(acc);
                        }
                    })
                    setFilteredChartAccounts(filteredAccs)
                    setSelectedChartAccount(filteredAccs[0])
                    setChartAccounts(accs)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [
        walletId,
        openDialog
    ])

    const onNewChartAccountCreate = async (chartAccount) => {
        console.log(chartAccount)
    }


    return (
        <>
            <CommonChartAccountCreate
                walletId={walletId}
                openDialog={openDialog}
                setOpenChart={setOpenChart}
                classifications={classifications}
                setClassifications={setClassifications}
                subTypes={subTypes}
                setSubTypes={setSubTypes}
                topLevelCategories={topLevelCategories}
                setTopLevelCategories={setTopLevelCategories}
                categories={categories}
                setCategories={setCategories}
                subCategories={subCategories}
                setSubCategories={setSubCategories}
                chartAccounts={chartAccounts}
                setChartAccounts={setChartAccounts}
                filteredChartAccounts={filteredChartAccounts}
                setFilteredChartAccounts={setFilteredChartAccounts}
                selectedChartAccount={selectedChartAccount}
                setSelectedChartAccount={setSelectedChartAccount}
                topLevelCategoryValue={topLevelCategoryValue}
                setTopLevelCategoryValue={setTopLevelCategoryValue}
                categoryValue={categoryValue}
                setCategoryValue={setCategoryValue}
                subCategoryValue={subCategoryValue}
                setSubCategoryValue={setSubCategoryValue}
                onNewChartAccountCreate={onNewChartAccountCreate}
                topLevelCategoryDisabled={false}
                categoryDisabled={false}
                subCategoryDisabled={false}
            />
        </>
    );
}
