import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

}));

const AddRentalRelation = (props)=> {

    const { 
        
    } = props;

    return (
        <div>
            <AddFinRel
                walletId={tx?.wallet}
                value={secParty}
                onSelect={onSelect}
                placeholder={`Search/Add ${isVendor?'Vendor':'Customer'}`}
            />
        </div>
    )
}

export default AddRentalRelation