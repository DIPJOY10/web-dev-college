import React from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";

function Login() {
  return (
    <div className="login">
      <form className="login__form" action="">
        <div className="row">
          <p>Name</p>
          <input type="text" />
        </div>
        <div className="row">
          <p>Password</p>
          <input type="password" />
        </div>
      </form>
      <div className="btn">
        <Link to="/acc">
          <button className="button" type="submit">
            Enter
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
