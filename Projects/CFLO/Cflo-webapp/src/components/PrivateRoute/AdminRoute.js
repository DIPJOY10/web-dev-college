import React, { useState } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminPrivate from "./AdminPrivate";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const loggedIn = user;
  const [open, setOpen] = useState(false);

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedIn ? (
          <AdminPrivate open={open} setOpen={setOpen}>
            <Component {...props} open={open} setOpen={setOpen} />
          </AdminPrivate>
        ) : (
          <Redirect
            to={{ pathname: "/about", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default AdminRoute;
