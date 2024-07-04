import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./DashBoard";
import Basic from "../basic";
import Layout from "../layout";
import RightBasic from "../RightBasic";

const BasicPrivateRoute = ({
  component: Component,
  noAppbar,
  hideDrawer,
  useBothSide,
  useRightSide,
  modDrawer,
  ...rest
}) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const loggedIn = user;
  // console.log("useRightSide", useRightSide);
  return (
    <Route
      {...rest}
      render={(props) =>
        loggedIn ? (
          <Layout
            noAppbar={noAppbar}
            hideDrawer={hideDrawer}
            modDrawer={modDrawer}
          >
            {useBothSide ? (
              <Component {...props} {...rest} />
            ) : useRightSide ? (
              <RightBasic>
                <Component {...props} {...rest} />
              </RightBasic>
            ) : (
              <Basic>
                <Component {...props} {...rest} />
              </Basic>
            )}
          </Layout>
        ) : (
          <Redirect
            to={{
              pathname: "/about",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

Layout.defaultProps = {
  hideDrawer: false,
  noAppbar: false,
  useRightSide: false,
  useBothSide: false,
  modDrawer: false,
};

Layout.propTypes = {
  /**
   * To display Drawer
   */
  hideDrawer: PropTypes.bool,

  /**
   * To display Appbar
   */
  noAppbar: PropTypes.bool,

  /*
   * To use right side of grid (used in forum)
   */
  useRightSide: PropTypes.bool,

  /*
   * To use full side of grid (used in forum)
   */
  useBothSide: PropTypes.bool,

  /*
   * To use moderator drawer of grid (used in forum)
   */
  modDrawer: PropTypes.bool,
};
export default BasicPrivateRoute;
