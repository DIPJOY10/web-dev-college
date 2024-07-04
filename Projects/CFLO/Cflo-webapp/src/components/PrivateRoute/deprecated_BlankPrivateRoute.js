import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';


const PrivateRoute = ({component: Component, ...rest}) => {
  const {user} = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');
  const loggedIn = user;

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedIn ? (
            <Component {...props} />
        ) : (
          <Redirect to={{pathname: '/about', state: {from: props.location}}} />
        )
      }
    />
  );
};


export default PrivateRoute;
