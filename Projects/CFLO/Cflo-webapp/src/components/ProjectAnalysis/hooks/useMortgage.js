import React, { useEffect, useState } from "react";
import useMortgageRefinancing from "./useMortgageRefinancing";
import { InputLabel, Switch } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  mortgageOn: {
    marginRight: "2.5rem",
    marginLeft: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

function useMortgage({
  showMortgage,
  mortgageState,
  setMortgageState,
  thisReport,
  updateReport,
}) {
  const classes = useStyles();
  const { mortgageOn } = classes;

  const mortgageRefinancingView = useMortgageRefinancing({
    thisReport,
    updateReport,
  });

  const mortgageView = (
    <div>
      {showMortgage === true ? (
        <div>
          <div className={mortgageOn}>
            <InputLabel>Mortgage Insurance (PMI)</InputLabel>
            <Switch
              checked={mortgageState.mOn}
              onChange={async (event) => {
                setMortgageState({
                  ...mortgageState,
                  [event.target.name]: event.target.checked,
                });
                const val = event.target.checked;
                if (val === false) {
                  updateReport({
                    refinanceUpfront: "",
                    refinanceRecurring: "",
                  });
                }
              }}
              name="mOn"
              color="primary"
            />
          </div>
          {mortgageState.mOn === true ? <>{mortgageRefinancingView}</> : null}
        </div>
      ) : null}
    </div>
  );
  return mortgageView;
}

export default useMortgage;
