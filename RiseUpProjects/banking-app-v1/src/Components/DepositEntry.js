import React from "react";
import "../css/DepositEntry.css";

function DepositEntry() {
  return (
    <div className="deposit">
      <h2>Deposit Entry Form</h2>
      <hr />
      <form className="dep_form" action="">
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
          <textarea name="" id="" cols="40" rows="3"></textarea>
        </div>
        <div className="row">
          <p>PIN</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Voter Card Number</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Adhar Card Number</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Date Of Birth</p>
          <input type="date" />
        </div>
        <div className="row">
          <p>Phone Number</p>
          <input type="phone" />
        </div>
        <div className="row">
          <p>Email</p>
          <input type="email" />
        </div>
        <h3>Deposit</h3>
        <div className="row">
          <p>Type</p>
          <input list="dep" />
          <datalist id="dep">
            <option value="FD"></option>
            <option value="RD"></option>
            <option value="MIS"></option>
            <option value="DD"></option>
          </datalist>
        </div>
        <div className="row">
          <p>Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Time Period</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Maturity Amount</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>Total Deposit Amount</p>
          <input type="number" />
        </div>
        <h3>Nomini Detail</h3>
        <div className="row">
          <p>Name</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Relationship</p>
          <input list="rltn" />
          <datalist id="rltn">
            <option value="Father"></option>
            <option value="Mother"></option>
            <option value="Husband"></option>
            <option value="Wife"></option>
            <option value="Brother"></option>
            <option value="Sister"></option>
          </datalist>
        </div>
        <div className="row">
          <p>Age</p>
          <input type="number" />
        </div>
        <div className="row">
          <p>ID Proof</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Maturity Type</p>
          <input list="type" />
          <datalist id="type">
            <option value="NEFT"></option>
            <option value="RTGS"></option>
            <option value="ECS"></option>
            <option value="CASH"></option>
          </datalist>
        </div>
        <div className="row">
          <p>REF/UTR/VC No.</p>
          <input type="number" />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default DepositEntry;
