import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CreateBtn from "../styled/actionBtns/create.btn";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Api from "../../helpers/Api";

import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},

  nameInput: {
    maxWidth: "24rem",
    margin: "1rem",
  },
}));

export default function NameAutocomplete(props) {
  const classes = useStyles();
  const { units, setUnits, projectTeamId, projectId } = props;

  const { root, nameInput } = classes;

  const placeholder = units || [];
  const [names, setNames] = useState([]);

  const createUnits = async () => {
    if (names.length > 0) {
      const rentalUnits = names.map((name) => {
        return {
          name,
          team: projectTeamId,
          project: projectId
        };
      });
      const res = await Api.post("project/unit/createMany", {
        units: rentalUnits,
      });
      const data = res.data;
      if (data?.length > 0) {
        setUnits([...units, ...data]);
      }
    }
  };

  useEffect(() => {
    if (units.length > 0) {
    } else {
      setNames(placeholder);
    }
  }, [placeholder]);

  useEffect(() => {
    setNames(["102A", "103A"]);
  }, []);

  return (
    <div className={root}>
      <div className={nameInput}>
        <Autocomplete
          multiple
          id="tags-filled"
          value={names}
          options={names.map((option) => option)}
          freeSolo
          onChange={(event, value, reason) => {
            setNames(value);
          }}
          renderTags={(value, getTagProps) => {
            return value.map((option, index) => {
              return (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              );
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Unit's Name (eg 102A) then press enter  "
            />
          )}
        />
      </div>

      <CreateBtn
        onClick={() => {
          createUnits(names);
          setNames([]);
        }}
      >
        Submit
      </CreateBtn>
    </div>
  );
}
