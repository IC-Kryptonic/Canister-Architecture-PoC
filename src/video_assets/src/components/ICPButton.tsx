import { Button, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import InternetIdentityLogo from '../assets/images/internet_identity_logo.svg';
import { AuthContext } from '../contexts/AuthContext';
import { TokenContext } from '../contexts/TokenContext';
import history from './History';

const ICPButton = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { nativeTokenBalance } = useContext(TokenContext);

  if (isAuthenticated) {
    return (
      <Button
        variant="contained"
        color="secondary"
        style={{
          padding: 0,
          backgroundColor: 'white',
          color: 'black',
          fontWeight: 400,
          width: 150,
        }}
        onClick={() => history.push('/marketplace/faucet')}
      >
        <Grid container alignItems="center" justify="center">
          <Grid item>
            <img src={InternetIdentityLogo} alt="ii-logo" height="40px" style={{ paddingTop: 6 }} />
          </Grid>
          <Grid item>{nativeTokenBalance}</Grid>
        </Grid>
      </Button>
    );
  }

  return (
    <Button variant="contained" color="primary" onClick={() => history.push('/marketplace/login')}>
      Sign in
    </Button>
  );
};

export default ICPButton;
