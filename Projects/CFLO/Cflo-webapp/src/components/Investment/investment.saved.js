import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import JobCard from './investment.card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Api from '../../helpers/Api';
import InvestmentCard from './investment.card';
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default function SavedInvestments() {
    const classes = useStyles();
    const { auth } = useSelector((state) => state);
    const { user } = auth;
    const profile = user?.profile;
    // let savedInvestmentsArr = [];
    const [savedInvestments, setSavedInvestments] = useState([]);
    const [loading, setIsLoading] = useState(true);
    useEffect(() => {

        Api.post('investment/getSavedInvestments', {
            profile, user
        }).then((res) => {
            setSavedInvestments(res);
            // for (const values of Object.values(res)) {
            //     savedInvestmentsArr.push(values?.parent);
            // }
            setIsLoading(false);
            console.log(savedInvestments, 'savedInvestments');
            // }
        })
    }, [profile, user, savedInvestments])
    const InvestmentCards = (investmentIds) => {
        if (investmentIds && investmentIds.length > 0) {
            return investmentIds.map((investment) => {
                if (investment) {
                    return (
                        <InvestmentCard investmentId={investment?.parent} />
                    );
                }
                else {
                    return null;

                }
            });
        }
        else {
            return null;
        }
    };
    return (
        <div className={classes.root}>
            {loading ? <CircularProgress /> : <>{InvestmentCards(savedInvestments)}</>}
        </div>
    )
}
