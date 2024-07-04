import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Select, MenuItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiSelect-root:focus": {
      //   paddingLeft: "10px",
      backgroundColor: "white",
    },
  },
  options: {},
}));

function SelectedCommunityDropDown() {
  const classes = useStyle();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth, forum } = useSelector((state) => state);
  const {
    joinedCommunitiesIds,
    joinedCommunitiesDict,
    selectedCommunity,
  } = forum;
  const [selection, setSelection] = useState(selectedCommunity?._id || "");

  function handleChange(event) {
    dispatch({
      type: "AddForum",
      payload: {
        selectedCommunity: joinedCommunitiesDict[event.target.value],
      },
    });
    setSelection(event.target.value);
    history.push("/explore/forum/communities/" + event.target.value);
  }

  return (
    <div>
      {
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={selection}
          onChange={handleChange}
          displayEmpty
          inputProps={{
            "aria-label": "Without label",
          }}
          style={{ padding: "0 10px" }}
          className={classes.root}
          disableUnderline
        >
          <MenuItem className={classes.options} value="" disabled>
            Your Communities
          </MenuItem>
          {joinedCommunitiesIds
            ? joinedCommunitiesIds.map((id) => {
              return joinedCommunitiesDict[id] ? (
                <MenuItem
                  key={id}
                  className={classes.options}
                  value={joinedCommunitiesDict[id]?.slug || ""}
                >
                  {joinedCommunitiesDict[id]?.displayName || ""}
                </MenuItem>
              ) : (
                <></>
              );
            })
            : null}
        </Select>
      }
    </div>
  );
}

export default SelectedCommunityDropDown;
