import { Button, CircularProgress, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../contexts/AuthContext';
import { authWithInternetIdentity } from '../services/auth_services';
import Layout from "../components/shared/Layout";

const Auth = () => {
  const { isLoading, isAuthenticated, setIsLoading, setIsAuthenticated } =
    useContext(AuthContext);

  if (isAuthenticated) {
    return <Redirect to="/" />;
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

  return (
    <Layout title={"Login"}>
      <Grid container justify="center" spacing={2}>
        <Grid container justify="center" item>
          <span>Du bist nicht eingeloggt!</span>
        </Grid>
        <Grid container justify="center" item>
          <span>Bitte authentifiziere dich via Internet Identity:</span>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: '200px', padding: 0 }}
            disabled={isLoading}
            onClick={authenticate}
          >
            {isLoading ? <CircularProgress /> : 'Zu Internet Identity'}
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Auth;
