import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CommonChartAccountCreate from '../../styled/CommonComponents/CommonCreateChartAccount';
import { getChartAccountTypes, getChartAccounts, createChartAccount } from '../chartaccount/api';
import { getIncomeChartAccounts } from '../offering/utils';


const useStyles = makeStyles({

});

export default function CreateChartAccountForTax(props) {
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
                    setCategories(types?.classifications?.group?.Liability)


                    //selected values
                        setTopLevelCategoryValue("Liability")
                        setCategoryValue("Other Current Liabilities")
                        setSubCategoryValue({
                            name: 'Advertising/Promotional',
                            debit: true,
                            qbType: 'AdvertisingPromotional',
                            description: 'Use Advertising/promotional to track money spent promoting your company.\n' +
                                'You may want different accounts of this type to track different promotional efforts (Yellow Pages, newspaper, radio, flyers, events, and so on). \n' +
                                'If the promotion effort is a meal, use Promotional meals instead.'
                        })
                        setCategories(types?.classifications?.group?.Liability)
                        setSubCategories(types?.subTypes?.["Other Current Liabilities"])
                })






                 const type = { classification: "Other Current Liabilities", wallet: walletId }
                 const classification = "Other Current Liabilities"

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
