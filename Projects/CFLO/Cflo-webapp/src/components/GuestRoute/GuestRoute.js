import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {connect} from 'react-redux';

const GuestRoute = ({component: Component, ...rest}) => {
  const {user} = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const loggedIn = user;

  return (
    <Route
      {...rest}
      render={(props) => (loggedIn ? <Redirect to={{pathname: '/', state: {from: props.location}}} /> : <Component {...props} />)}
    />
  );
};

export default GuestRoute;
