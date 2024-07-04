import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom:"5px"
  },
  input: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: "4px",
    padding: "0px 5px",
    border: "1px solid lightgrey",
  },
  icon: {
    color: theme.palette.primary.main,
  },
  addButton: {
    display: (props) => (props.last ? "inline-flex" : "none"),
  },
}));

function PollInput({
  idx = 0,
  last = false,
  pollOptions = [],
  setPollOptions,
  setIsPoll = () => { },
}) {
  const classes = useStyles({ last });
  return (
    <div className={classes.root}>
      <InputBase
        multiline={false}
        value={pollOptions[idx]}
        onChange={(event) => {
          const newArray = [...pollOptions];
          newArray[idx] = event.target.value;
          setPollOptions(newArray);
        }}
        placeholder={"Option"}
        className={classes.input}
      />
      <IconButton
        aria-label="add-option"
        className={classes.addButton}
        onClick={() => {
          setPollOptions((prev) => {
            const newArr = [...prev];
            newArr.push("");
            last = false;
            return newArr;
          });
        }}
      >
        <AddCircleIcon className={classes.icon} />
      </IconButton>
      <IconButton
        aria-label="cancle-option"
        onClick={() => {
          setPollOptions((prev) => {
            const temp = prev.filter((el, index) => index !== idx);
            if (temp.length === 0) {
              setIsPoll(false);
              return [""];
            }
            return temp;
          });
        }}
      >
        <CancelIcon className={classes.icon} />
      </IconButton>
    </div>
  );
}

PollInput.propTypes = {
  idx: PropTypes.number,
  pollOptions: PropTypes.array,
  setPollOptions: PropTypes.func,
  setIsPoll: PropTypes.func,
  last: PropTypes.bool,
};

export default PollInput;
