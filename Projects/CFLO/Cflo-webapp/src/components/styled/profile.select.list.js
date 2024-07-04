import React, { useEffect, useState } from "react";
import { useTheme, alpha, makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ButtonBase from "@material-ui/core/ButtonBase";
import InputBase from "@material-ui/core/InputBase";
import AvatarLocal from "../profile/avatar";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 221,
    fontSize: 13,
    margin: "1rem 0",
  },
  button: {
    fontSize: "1rem",
    // textAlign: "left",
    paddingBottom: 8,
    // color: "#0366d6",
    backgroundColor: "white",
    padding: "0.5rem 0.5rem",
    // fontWeight: 600,
    // "&:hover,&:focus": {
    //   color: "#0366d6",
    // },
    // "& span": {
    //   width: "100%",
    // },
    // "& svg": {
    //   width: 16,
    //   height: 16,
    // },
  },

  tag: {
    marginTop: 3,
    height: 20,
    padding: ".15em 4px",
    fontWeight: 600,
    lineHeight: "15px",
    borderRadius: 2,
  },
  popper: {
    border: "1px solid rgba(27,31,35,.15)",
    boxShadow: "0 3px 12px rgba(27,31,35,.15)",
    borderRadius: 3,
    width: "15rem",
    zIndex: 2500,
    fontSize: 13,
    color: "#586069",
    opacity: 1,
    backgroundColor: "white",
  },
  header: {
    borderBottom: "1px solid #e1e4e8",
    padding: "8px 10px",
    fontWeight: 600,
  },
  inputBase: {
    padding: 10,
    width: "100%",
    borderBottom: "1px solid #dfe2e5",
    "& input": {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      padding: 8,
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      border: "1px solid #ced4da",
      fontSize: 14,
      "&:focus": {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  paper: {
    boxShadow: "none",
    margin: 0,
    color: "#586069",
    fontSize: 13,
  },
  option: {
    minHeight: "auto",
    alignItems: "flex-start",
    padding: 8,
    '&[aria-selected="true"]': {
      backgroundColor: "transparent",
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  // popperDisablePortal: {
  // 	position: "relative",
  // },

  avatar: {
    height: "1.4rem",
    width: "1.4rem",
    marginLeft: "1rem",
  },

  listStyle: {
    zIndex: "3000",
  },

  listItem: {
    pointer: "cursor",
  },

  color: {
    width: 14,
    height: 14,
    flexShrink: 0,
    borderRadius: 3,
    marginRight: 8,
    marginTop: 2,
  },

  text: {
    flexGrow: 1,
  },
}));

export default function ProfileSelectList(props) {
  const classes = useStyles();
  const { entity, entities, setEntity, displayOwner } = props;
  // console.log("logging status ", props);
  const [dense, setDense] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);

    console.log(open, " is the open, handleClick ");
  };

  const handleClose = (event, reason) => {
    setOpen(false);
    if (reason === "toggleInput") {
      return;
    }

    if (anchorEl) {
      anchorEl.focus();
    }

    setAnchorEl(null);
  };

  // const id = open ? "github-label" : undefined;

  return (
    <React.Fragment>
      <ButtonBase
        disableRipple
        className={classes.button}
        aria-describedby={entity?._id}
      >
        {entity?.displayName && displayOwner ? entity?.displayName : null}
        <AvatarLocal src={entity} className={classes.avatar} />

        <ArrowDropDownIcon onClick={(ev) => handleClick(ev)} />
      </ButtonBase>

      <Popper
        id={entity?._id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        className={classes.popper}
        onClose={handleClose}
      >
        <List dense={dense} className={classes.listStyle}>
          {entities?.map((item) => {
            return (
              <ListItem
                className={classes.listItem}
                onClick={() => {
                  setOpen(false);
                  setEntity(item);
                }}
              >
                <ListItemAvatar>
                  <AvatarLocal src={item} className={classes.avatar} />
                </ListItemAvatar>
                <ListItemText primary={item?.displayName} />
              </ListItem>
            );
          })}
        </List>
      </Popper>
    </React.Fragment>
  );
}
