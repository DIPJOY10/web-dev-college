import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Components/Home";
import Nav from "./Components/Nav";
import Register from "./Components/Register";
import DepositEntry from "./Components/DepositEntry";
import "./App.css";
import Loan from "./Components/Loan";
import LoanEntry from "./Components/LoanEntry";
import EMIEntry from "./Components/EMIEntry";
import Login from "./Components/Login";
import Logo from "./Components/Logo";

function App() {
  return (
    <Router>
      <div className="app">
        <Logo />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/acc" exact component={Nav} />
          <Route path="/register" exact component={Register} />
          <Route path="/depositentry" exact component={DepositEntry} />
          <Route path="/loan" exact component={Loan} />
          <Route path="/loanEntry" exact component={LoanEntry} />
          <Route path="/emiEntry" exact component={EMIEntry} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
