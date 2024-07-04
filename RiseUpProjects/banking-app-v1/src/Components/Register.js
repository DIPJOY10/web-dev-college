import React from "react";
import "../css/Register.css";

function Register() {
  return (
    <div className="entry">
      <h2>Member Entry</h2>

      <div className="separate"></div>

      <form className="form">
        <div className="row">
          <label htmlFor="">Name</label>
          <input name="userName" type="text" />
        </div>

        <div className="row">
          <label htmlFor="">Father's Name</label>
          <input name="fName" type="text" />
        </div>

        <div className="row">
          <label htmlFor="">Address</label>
          <textarea name="address" id="" cols="50" rows="3"></textarea>
        </div>

        <div className="row">
          <label htmlFor="">PIN NO.</label>
          <input name="pin" type="number" />
        </div>

        <div className="row">
          <label htmlFor="">pan card no.</label>
          <input name="pan" type="text" />
        </div>

        <div className="row">
          <label htmlFor="">voter card no.</label>
          <input name="voter" type="text" />
        </div>

        <div className="row">
          <label htmlFor="">adhar card no.</label>
          <input name="adhar" type="number" />
        </div>

        <div className="row">
          <label htmlFor="">Date Of Birth</label>
          <input name="dob" type="date" />
        </div>

        <div className="row">
          <label htmlFor="">Email</label>
          <input name="email" type="email" />
        </div>

        <div className="row">
          <button className="button" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
