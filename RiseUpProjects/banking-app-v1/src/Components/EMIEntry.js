import React from "react";
import "../css/EMIEntry.css";

function EMIEntry() {
  return (
    <div className="emi">
      <h3>Loan Holder Details</h3>
      <form className="form" action="">
        <div className="row">
          <p>Application Name</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Branch Name</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Loan Account number</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Member ID</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Loan Category</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Sub Category</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Plan Code</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Approved Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Loan Tenure</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Payment Mode</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Number of Installments</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Interest Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Total Payable</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>EMI Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Processing Charge</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Other Charges</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Annual Interest Rate</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Interest Type</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Advisor Name</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Member Name</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>City</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>State</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Mobile Number</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Narration</p>
          <input type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EMIEntry;
