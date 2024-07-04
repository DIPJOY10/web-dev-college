import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Typography } from '@material-ui/core';
import { useDebounce } from 'react-use';
import Api from '../../helpers/Api';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function LinearScale(props) {
    const classes = useStyles();
    const { questionId, question, isActive } = props;
    const [lb, setLb] = React.useState(question?.lowerbound || '');
    const [ub, setUb] = React.useState(question?.upperbound || '');

    const updateApi = async (question) => {
        const res = await Api.post("question/update", question);

    };

    useDebounce(
        () => {
            if (questionId) {
                updateApi({
                    _id: questionId,
                    lowebound: lb,
                    upperbound: ub
                });
            }
        },
        100,
        [questionId, lb, ub]
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">LB</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={lb}
                    onChange={(event) => { setLb(event.target.value); console.log(lb) }}
                    label="Lower Bound"
                    disabled={!isActive}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                </Select>
            </FormControl>
            <Typography variant="subtitle2">to</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">UB</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={ub}
                    onChange={(event) => { setUb(event.target.value); console.log(ub) }}
                    label="Upper Bound"
                    disabled={!isActive}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
