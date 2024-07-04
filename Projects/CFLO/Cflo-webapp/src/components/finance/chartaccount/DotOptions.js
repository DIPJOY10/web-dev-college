import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from "react-router-dom";


export default function DropdownMenu(props) {
    const { handleClick, 
            open, 
            anchorEl,  
            handleClose,
            data,
            selectedDropdown,
            openEditDialog
            } = props;

    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(e) =>handleClick(data,e)}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 148 * 4.5,
                        width: '14ch',
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 2px 5px 0px",
                        marginLeft: "-10px"
                    },
                }}
            >
                <MenuItem onClick={()=> openEditDialog(selectedDropdown)} >View/Edit</MenuItem>
                <MenuItem  >Delete</MenuItem>
            </Menu>
        </>
    );
}
