import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Api from '../../helpers/Api';
import InvestmentCard from './investment.card';
import CircularProgress from '@material-ui/core/CircularProgress';
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

}));
export default function ApplicationsApplied() {
    const classes = useStyles();
    const { auth } = useSelector((state) => state);
    const { user } = auth;
    const userId = user?.profile;
    const parentModelName = "Investment";
    const [appliedInvestments, setAppliedInvestments] = useState(null);
    const [loading, setIsLoading] = useState(true);
    useEffect(() => {
        Api.post('apply/getApplications', {
            userId, parentModelName
        }).then((res) => {
            setAppliedInvestments(res);
            setIsLoading(false);
            console.log(appliedInvestments, "Parent");
        })
    }, [userId, appliedInvestments])
    const InvestmentCards = (investmentIds) => {
        if (investmentIds && investmentIds.length > 0) {
            return investmentIds.map((investment) => {
                if (investment) {
                    return (
                        <InvestmentCard investmentId={investment?.parent?._id} />
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
        <div className={classes.root}>{loading ? <CircularProgress /> : <>{InvestmentCards(appliedInvestments)}</>}</div>
    )
}
