import React from "react";
import { Link } from "react-router-dom";
import "../css/Nav.css";

function Nav() {
  return (
    <div className="navbar">
      <nav>
        <ul className="nav_links">
          <Link className="link" to="/register">
            <li>Member Registration</li>
          </Link>
          <Link className="link" to="/depositentry">
            <li>Deposit Entry</li>
          </Link>
          <Link className="link" to="/loan">
            <li>Loan Entry</li>
          </Link>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
