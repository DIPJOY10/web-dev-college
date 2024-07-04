import React from "react";
import "../css/Logo.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className="logo">
      <Link className="logo__name" to="/">
        <p>Riseup Consultancy</p>
      </Link>
    </div>
  );
}

export default Logo;
