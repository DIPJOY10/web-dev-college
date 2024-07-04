import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Button, Grow, Typography, useMediaQuery } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import MyAutocomplete from '../../styled/CommonComponents/MyAutoComplete';
import Dialog from "@material-ui/core/Dialog";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import BusinessIcon from '@material-ui/icons/Business';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import _ from 'lodash';
import config from "../../../config/index";
import { criteriaLabelArr } from "../criteria.label.data"
import Autocomplete from "@material-ui/lab/Autocomplete";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { createCompareReports, fetchReports, getAllAdminProfileCriteria, getReports, getCompareReports, getReportsByIdsArr, updateCompareReport } from "../api.call";
import { reportDataCalculation } from "../CalculationFunctions";
import "./index.css"
import Footer from "../../landing/footer/footer";


const useStyles = makeStyles((theme) => ({

}));

export default function SavedCompareReports(props) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const theme = useTheme();
    const { compareId, publicParam } = useParams();
    const { } = props

    const { auth, team: teamReducer } = useSelector((state) => state);
    const { user } = auth


    










    return (
        <div>

        </div>
    );
}
