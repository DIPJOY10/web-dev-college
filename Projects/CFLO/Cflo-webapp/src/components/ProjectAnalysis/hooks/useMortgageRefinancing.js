import React, { useEffect, useState } from "react";
import FormTextField from "../FormTextField";

function useMortgageRefinancing({ thisReport, updateReport }) {
  const [refinanceUpfront, setRefinanceUpfront] = useState("");
  const [refinanceRecurring, setRefinanceRecurring] = useState("");

  useEffect(() => {
    setRefinanceUpfront(thisReport.refinanceUpfront);
    setRefinanceRecurring(thisReport.refinanceRecurring);
  }, [thisReport.refinanceUpfront, thisReport.refinanceRecurring]);

  return (
    <div>
      <FormTextField
        label={"Upfront (% of Loan)"}
        val={refinanceUpfront}
        Handler={async (e) => {
          const val = e.target.value;
          setRefinanceUpfront(val);
          updateReport({ refinanceUpfront: val });
        }}
      />
      <FormTextField
        label={"Recurring (% of Loan Per year)"}
        val={refinanceRecurring}
        Handler={async (e) => {
          const val = e.target.value;
          setRefinanceRecurring(val);
          updateReport({ refinanceRecurring: val });
        }}
      />
    </div>
  );
}

export default useMortgageRefinancing;
