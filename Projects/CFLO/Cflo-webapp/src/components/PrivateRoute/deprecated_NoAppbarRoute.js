import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Dashboard from '../DashBoard/NoAppBarDashBoard';
import Basic from '../basic';

const NoAppbarPrivateRoute = ({component: Component, ...rest}) => {
  const {user} = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const loggedIn = user;

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedIn ? (
          <Dashboard>
            <Basic>
              <Component {...props} />
            </Basic>
          </Dashboard>
        ) : (
          <Redirect to={{pathname: '/about', state: {from: props.location}}} />
        )
      }
    />
  );
};


export default NoAppbarPrivateRoute;
