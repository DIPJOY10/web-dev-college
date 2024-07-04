import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CommonChartAccountCreate from '../../styled/CommonComponents/CommonCreateChartAccount';
import { getChartAccountTypes, getChartAccounts, createChartAccount } from '../chartaccount/api';
import { getIncomeChartAccounts } from './utils';

const useStyles = makeStyles({

});

export default function ChartAccountCreateForInvoice(props) {
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

                    //options
                    setTopLevelCategories(types?.classifications?.categories)
                    setCategories(types?.classifications?.group?.Asset)

                    //selected values
                        setTopLevelCategoryValue("Revenue")
                        setCategoryValue("Income")
                        setSubCategoryValue({
                            name: 'Discounts/Refunds Given',
                            debit: false,
                            qbType: 'DiscountsRefundsGiven',
                            description: 'Use Discounts/refunds given to track discounts you give to customers. \n' +
                                'This account typically has a negative balance so it offsets other income. \n' +
                                'For discounts from vendors, use an expense account, instead.'
                        })
                        setSubCategories(types?.subTypes?.["Income"])
                })

 
                 const type = { classification: "Income", wallet: walletId }
                 const classification = "Income"
        
                getIncomeChartAccounts({type})
                    .then((accs) => {
                        let filteredAccs = []
                        accs.map((acc) => {
                            if (acc?.classification === classification) {
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
                topLevelCategoryDisabled={true}
                categoryDisabled={true}
                subCategoryDisabled={false}
            />
        </>
    );
}
