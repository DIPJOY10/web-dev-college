import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import arrayToReducer from '../../helpers/arrayToReducer';
import _ from 'lodash';
import CatAutocomplete from './cat.autocomplete';
import { Chip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            alignItems: 'unset',
        },
    },
    chipGroup: {
        display: 'flex', flexDirection: 'row', [theme.breakpoints.down('xs')]: { flexDirection: 'column', marginLeft: '1vh' },
        marginBottom: '2vh'
    },
    selectedChip: {
        backgroundColor: theme.palette.primary.main,
        margin: theme.spacing(0.5),
    },
}));

export default function ManageCategory(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const {
        selectedChip
    } = classes
    const {
        cats: oldCats, catIds, setCatIds
    } = props;

    const [catDict, setCatDict] = useState([])

    const addCats = (newCats) => {
        const {
            newDict, idArr
        } = arrayToReducer(newCats)


        setCatDict({
            ...catDict, ...newDict
        })

        setCatIds(Array.from(new Set([...catIds, ...idArr])));

    }

    const removeCat = (catId) => {
        var newArr = [...catIds]
        setCatIds(_.difference(newArr, [catId]))
    }

    useEffect(() => {
        if (oldCats && oldCats.length > 0) {
            addCats(oldCats)
        }
    }, [oldCats?.length])

    const {
        root, row, col,
    } = classes;

    return (
        <div className={root}>
            <CatAutocomplete
                catIds={catIds}
                catDict={catDict}
                addCats={addCats}
                removeCat={removeCat}
            />
            <div className={classes.chipGroup}>
                {catIds.map(catId => {
                    const cat = catDict[catId];

                    return (
                        <Chip
                            key={catId}
                            label={cat?.name}
                            className={selectedChip}
                            color="primary"
                            onDelete={() => removeCat(catId)}
                        />

                    )
                })}
            </div>
        </div>
    );
}
