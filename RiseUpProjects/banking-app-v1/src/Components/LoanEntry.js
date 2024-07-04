import React from "react";
import "../css/LoanEntry.css";

function LoanEntry() {
  return (
    <div className="loanEntry">
      <h2>New Loan Entry</h2>
      <hr />
      <form className="form" action="">
        <div className="row">
          <p>Member Code</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Name</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Address</p>
          <textarea name="" id="" cols="35" rows="2"></textarea>
        </div>
        <div className="row">
          <p>PIN No.</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>PAN Card No.</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Voter Card No.</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Adhar Card No.</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Date Of Birth</p>
          <input type="date" />
        </div>
        <div className="row">
          <p>Phone No.</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Email</p>
          <input type="email" />
        </div>
        <div className="row">
          <p>Photo</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Signature</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Monthly Income</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Occupation</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Required Loan Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Credit Score</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Sanction Amount Loan</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Loan Period</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Loan Type</p>
          <input list="loanType" />
          <datalist id="loanType">
            <option value="Weekly"></option>
            <option value="Daily"></option>
            <option value="Monthly"></option>
          </datalist>
        </div>
        <div className="row">
          <p>Colateral For loan</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Colateral Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Installment Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Payment Type</p>
          <input list="payType" />
          <datalist id="payType">
            <option value="NEFT"></option>
            <option value="CASH"></option>
            <option value="WITH IN SB"></option>
          </datalist>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default LoanEntry;
