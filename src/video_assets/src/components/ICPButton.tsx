import { Button, Grid } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import InternetIdentityLogo from '../assets/images/internet_identity_logo.svg';
import { AuthContext } from '../contexts/AuthContext';
import { getBalanceForIdentity } from '../services/token_services';

const ICPButton = () => {
  const { isAuthenticated, identity } = useContext(AuthContext);
  const [balance, setBalance] = useState<null | number>(null);

  console.log(identity);

  useEffect(() => {
    async function getBalance() {
      try {
        const balanceForIdentity = await getBalanceForIdentity(identity);
        setBalance(balanceForIdentity);
      } catch (error) {
        console.error('Error retrieving identity for authenticated user', error);
      }
    }

    if (identity) getBalance();
  }, [identity]);

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
        }}
        onClick={() => {}}
      >
        <Grid container alignItems="center" justify="center">
          <Grid item>
            <img src={InternetIdentityLogo} alt="ii-logo" height="40px" style={{ paddingTop: 6 }} />
          </Grid>
          <Grid item>{'0.00'}</Grid>
        </Grid>
      </Button>
    );
  }

  return (
    <Button variant="contained" color="primary">
      Sign in
    </Button>
  );
};

export default ICPButton;
