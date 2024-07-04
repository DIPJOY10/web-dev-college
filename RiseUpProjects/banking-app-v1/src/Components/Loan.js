import React from "react";
import { Link } from "react-router-dom";
import "../css/Loan.css";

function Loan() {
  return (
    <div className="loan">
      <div className="loan__links">
        <Link to="/loanEntry" className="loan__link">
          New Loan Entry
        </Link>
      </div>
      <div className="loan__links">
        <Link to="/emiEntry" className="loan__link">
          New EMI Entry
        </Link>
      </div>
    </div>
  );
}

export default Loan;
