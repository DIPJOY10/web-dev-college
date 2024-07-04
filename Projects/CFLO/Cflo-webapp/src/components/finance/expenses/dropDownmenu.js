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
            deleteTxById, 
            walletId, 
            handleClose,
            tx,
            dropdown,
            pathType,
            showSideBar,
            setAnchorEl,
            generatorRunning,
            stopGetClicked
            } = props;
    const transactionGetClicked = (Id)=>{ 
        showSideBar(Id);
        setAnchorEl(null)
    }
            
    

    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={(e) =>handleClick(tx,e)}
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
                <MenuItem onClick={handleClose}>Print</MenuItem>
                <MenuItem component={Link} to={`/admin/${walletId}${pathType}${dropdown?._id}/edit`} >View/Edit</MenuItem>
                <MenuItem onClick={()=> deleteTxById(dropdown)} >Delete</MenuItem>
                {pathType === '/txtmplate/' ? <MenuItem onClick={()=> transactionGetClicked(dropdown?._id) } >Transactions</MenuItem>  : null}
                {pathType === '/txtmplate/' ? <MenuItem onClick={()=> stopGetClicked(dropdown) } >{dropdown?.generatorRunning ? "stop" : "start"}</MenuItem>  : null}
            </Menu>
        </>
    );
}
