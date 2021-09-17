import { Button, CircularProgress, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../../components/marketplace/MarketplaceHeader';
import { AuthContext } from '../../contexts/AuthContext';
import { authWithInternetIdentity } from '../../services/auth_services';
import { Secp256k1KeyIdentity } from '@dfinity/identity';
import { HttpAgent } from '@dfinity/agent';

const MarketplaceAuth = () => {
  const { isLoading, isAuthenticated, setIsLoading, setIsAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Redirect to="/marketplace/markets" />;
  }

  const authenticate = async () => {
    setIsLoading(true);
    try {
      const authenticatedNow = await authWithInternetIdentity();
      setIsAuthenticated(authenticatedNow);
    } catch (error) {
      console.error('Error authenticating with Internet Identity', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fakeAuthenticate = async () => {
    setIsLoading(true);
    try {
      const identity = Secp256k1KeyIdentity.generate();
      console.log(new HttpAgent({ identity }));
    } catch (error) {
      console.error('Error generating Internet Identity', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Grid container justify="center" spacing={2}>
        <Grid container justify="center" item style={{ marginTop: 20 }}>
          <span>Please authenticate via Internet Identity:</span>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: '200px', padding: 0 }}
            disabled={isLoading}
            onClick={authenticate}
          >
            {isLoading ? <CircularProgress /> : 'Go to Internet Identity'}
          </Button>
        </Grid>

        <Grid container justify="center" item style={{ marginTop: 30 }}>
          <span>Or choose one of the following identities for demo purposes:</span>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: '200px', padding: 0 }}
            disabled={isLoading}
            onClick={fakeAuthenticate}
          >
            {isLoading ? <CircularProgress /> : 'Gabriela Huang'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: '200px', padding: 0 }}
            disabled={isLoading}
            onClick={fakeAuthenticate}
          >
            {isLoading ? <CircularProgress /> : 'Bronte Bean'}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default MarketplaceAuth;
