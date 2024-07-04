import React, {useCallback, useEffect, FunctionComponent} from 'react';
import {usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess} from 'react-plaid-link';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {exchangeToken} from './api';

const OpenPlaidLink = ({token}) => {
  const {plaidLinkToken} = useSelector((state) => state.wallet);

  const dispatch = useDispatch();
  const history = useHistory();
  const path = '/admin/' + plaidLinkToken?.walletId + '/banking_setup';

  const onSuccess = useCallback(async (publicToken, metadata) => {
    // send public_token to server
    const data = await exchangeToken(plaidLinkToken?.walletId, metadata);

    history.push(path);
  }, []);

  const onExit = useCallback(async (err, metadata) => {
    // send public_token to server
    history.push(path);
  }, []);

  const config = {
    // When re-initializing Link after OAuth redirection, the same
    // Link token from the first initialization must be used
    token: plaidLinkToken.link_token,
    onSuccess,
    // receivedRedirectUri: document.location.href, // required for OAuth
    onExit,
    // onEvent
  };

  if (window.location.href.includes('?oauth_state_id=')) {
    config.receivedRedirectUri = window.location.href;
  }

  const {open, ready, error} = usePlaidLink(config);

  // this opens link as soon as it's ready
  useEffect(() => {
    if (!ready) {
      return;
    }
    open();
  }, [ready, open]);

  // don't render anything, just open Link
  return null;
};

export default OpenPlaidLink;
