import React, { useState } from 'react';
// import { useMinimalSelectStyles } from '@mui-treasury/styles/select/minimal';
import questiontypeStyles from './questiontype.styles'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShortTextIcon from '@material-ui/icons/ShortText';
import SubjectIcon from '@material-ui/icons/Subject';
import { ListItemIcon } from '@material-ui/core';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AppsIcon from '@material-ui/icons/Apps';
import EventIcon from '@material-ui/icons/Event';
import ScheduleIcon from '@material-ui/icons/Schedule';
import LinearScaleIcon from '@material-ui/icons/LinearScale';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
// Original design here: https://github.com/siriwatknp/mui-treasury/issues/540

const MinimalSelect = (props) => {
    const { setType, type } = props;
    const typeToValue = (value) => {
        if (value == "Short Answer")
            return 0;
        else if (value == "Long Answer")
            return 1;
        else if (value == "Multiple Choice")
            return 2;
        else if (value == "Boolean")
            return 3;
        else if (value == "Date")
            return 6;
        else if (value == "Linear Scale")
            return 8;
        else if (value == "Multiple Choice Grid")
            return 9;
        else if (value == "Checkbox Grid")
            return 10;
    }
    const [val, setVal] = useState(typeToValue(type) ? typeToValue(type) : 0);
    const valueToType = (value) => {
        if (value == 0)
            return "Short Answer";
        else if (value == 1)
            return "Long Answer";
        else if (value == 2)
            return "Multiple Choice";
        else if (value == 3)
            return "Boolean";
        else if (value == 6)
            return "Date";
        else if (value == 8)
            return "Linear Scale";
        else if (value == 9)
            return "Multiple Choice Grid";
        else if (value == 10)
            return "Checkbox Grid";
    }
    const handleChange = (event) => {
        setVal(event.target.value);
        setType(valueToType(event.target.value));
    };

    const minimalSelectClasses = questiontypeStyles();

    const iconComponent = (props) => {
        return (
            <ExpandMoreIcon className={props.className + " " + minimalSelectClasses.icon} />
        )
    };
    // moves the menu below the select input
    const menuProps = {
        classes: {
            paper: minimalSelectClasses.paper,
            list: minimalSelectClasses.list
        },
        anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
        },
        transformOrigin: {
            vertical: "top",
            horizontal: "left"
        },
        getContentAnchorEl: null
    };

    return (
        <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
            <Select
                // disableUnderline
                classes={{ root: minimalSelectClasses.select }}
                MenuProps={menuProps}
                IconComponent={iconComponent}
                value={val}
                onChange={handleChange}
                variant="outlined"
            >
                <MenuItem value={0}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <ShortTextIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Short Answer
                    </span>
                </MenuItem>
                <MenuItem value={1}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <SubjectIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Long Answer
                    </span>
                </MenuItem>
                <MenuItem value={2}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <RadioButtonCheckedIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Multiple Choice
                    </span>
                </MenuItem>
                <MenuItem value={3}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <CheckCircleIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Boolean
                    </span>
                </MenuItem>
                <MenuItem value={4}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <ArrowDropDownCircleIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Dropdown
                    </span>
                </MenuItem>
                <MenuItem value={5}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <CloudUploadIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        File Upload
                    </span>
                </MenuItem>
                <MenuItem value={6}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <EventIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Date
                    </span>
                </MenuItem>
                <MenuItem value={7}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <ScheduleIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Time
                    </span>
                </MenuItem>
                <MenuItem value={8}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <LinearScaleIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Linear Scale
                    </span>
                </MenuItem>
                <MenuItem value={9}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <DragIndicatorIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Multiple Choice Grid
                    </span>
                </MenuItem>
                <MenuItem value={10}>
                    <ListItemIcon classes={{ root: minimalSelectClasses.listIcon }}>
                        <AppsIcon />
                    </ListItemIcon>
                    <span style={{ marginTop: 2, fontSize: "14px" }}>
                        Checkbox Grid
                    </span>
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default MinimalSelect;