import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Api from "../../../helpers/Api";
import { useDebounce } from "react-use";
import { InputBase, TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { indexOf } from "lodash";

const useStyles = makeStyles((theme) => ({
  selected_input: {
    cursor: "pointer",
    border: "1px solid #2196f3",
    borderRadius: "5px",
    fontSize: ".7rem",
    backgroundColor: "white",
    color: '#2196f3',
    opacity: 0.95,
    fontWeight: "600",
    margin: "0.1rem",
    padding: "3px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: "0.3rem 0.5rem"
  },
  input: {
    width: '100%',
    '& input': {
      'width': '100%',
      'color': 'black',
      'transition': theme.transitions.create(['border-color', 'box-shadow']),
      'fontSize': 15,
    },
  },
}));

export default function SkillAutocomplete(props) {
  const classes = useStyles();
  const { skills, setSkills, catIds, catDict, inputRef, setInputRef, handleInputRemoval, inputRemove } = props;

  const { selected_input, input } = classes;
  const oldCats = catIds.map((catId) => catDict[catId]);
  const oldCatNames = oldCats.map((cat) => cat?.name);
  const [options, setOptions] = useState([]);
  const [text, setText] = useState("");
  const chipRef = useRef(null)

  const sendQuery = async () => {
    if (text.length > 1) {
      const res = await Api.post("category/getCats", {
        name: text,
      });
      const data = res.data;
      if (data?.length > 0) {
        const names = data.map((cat) => cat.name);
        setOptions(names);
      }
    }
  };

  useEffect(() => {
    if (inputRemove) {
      setSkills((prev) => {
        let removeData = prev.filter((f) => f !== inputRemove)
        return removeData
      })
    } else {
      setSkills([]);
    }
  }, [inputRemove]);

  useDebounce(
    () => {
      sendQuery();
    },
    500,
    [text]
  );
  return (
    <Autocomplete
      style={{ width: "100%" }}
      multiple
      size="small"
      id="tags-filled"
      value={skills}
      color='white'
      options={options.map((option) => option)}
      // freeSolo
      onChange={(event, value, reason) => {
        setSkills(value);
      }}
      onInputChange={(event, value, reason) => {
        console.log(value, " is the onInputChange");
        setText(value);
      }}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => {
          return (
            <div
              key={index}
              className={selected_input}
              onClick={() => {
                value.splice(indexOf(option), 1)
                handleInputRemoval(option)
              }}
            >
              {option} <Delete style={{ fontSize: 16, marginLeft: "0.5rem" }} />
            </div>
          );
        });
      }}
      renderInput={(params) => (
        <TextField
          className={input}
          required
          {...params}
          inputRef={(input) => {
            setInputRef(input);
          }}
          variant="outlined"
          placeholder="eg. Legal and tax professional"
          label="Enter Skill & Press Enter"
        />
      )}
    />
  );
}
