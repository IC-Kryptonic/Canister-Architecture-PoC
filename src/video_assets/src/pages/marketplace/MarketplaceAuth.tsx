import { Button, CircularProgress, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../../components/marketplace/MarketplaceHeader';
import Layout from "../../components/shared/Layout";
import { AuthContext } from '../../contexts/AuthContext';
import { authWithInternetIdentity } from '../../services/auth_services';
import { HttpAgent, Identity } from '@dfinity/agent';
import { identityBronte, identityGabriela } from '../../mocks/marketplace/identities';
import InternetIdentityButton from '../../components/IIButton';

const MarketplaceAuth = () => {
  const { isLoading, isAuthenticated, setIsLoading, setIsAuthenticated, setIdentity } =
    useContext(AuthContext);

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

  const fakeAuthenticate = async (identity: Identity) => {
    setIsLoading(true);
    try {
      setIdentity(identity);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error setting fake Internet Identity', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title={"Dashboard"} marginTop={20} marketPlaceHeader>
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
          <InternetIdentityButton
            name={'Gabriela Hung'}
            callback={() => fakeAuthenticate(identityGabriela)}
          />
        </Grid>
        <Grid item>
          <InternetIdentityButton
            name={'Bronte Bean'}
            callback={() => fakeAuthenticate(identityBronte)}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MarketplaceAuth;
