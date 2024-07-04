import React, { useState, useEffect } from "react";
import { getPropertyType } from './api.call'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    autoComplete_container: {
        display: "flex",
    },
}));

export default function usePropertyTypeSelect(props) {
   
    const {
        project
    } = props;

    const classes = useStyles();

    const {
        autoComplete_container
    } = classes;

    const [primary, setPrimary] = useState([]);
    const [category, setCategory] = useState(project?.category || "");
    const [subCategories, setSubCategories] = useState([]);
    const [subCategory, setSubCategory] = useState(project?.subCategory || "");



    useEffect(() => {
        getPropertyType()
          .then((data) => {
            setPrimary(data.primary);
            setTypes(data);
          })
          .catch((err) => {
            console.log(err);
          });
    }, []);
    
   
    const PropTypeSelectView =  (
        <div className={autoComplete_container}>
        <Autocomplete
          id="propertyType"
          options={primary}
          value={category}
          getOptionLabel={(option) => option}
          style={{ width: 250 }}
          onChange={(event, value) => {
            onCategorySelect(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Property Type" variant="outlined" />
          )}
        />
        {category !== null ? (
          <Autocomplete
            id="propertyCategory"
            options={subCategories}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            value={subCategory}
            onChange={(event, value) => {
              setSubCategory(value);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Main Category" variant="outlined" />
            )}
          />
        ) : null}
      </div>
    );

    return {
        category, subCategory, PropTypeSelectView
    }
}