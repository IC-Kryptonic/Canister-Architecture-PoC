import { Button, Grid } from '@material-ui/core';
import React from 'react';
import Header from '../components/Header';

const Auth = () => {
  return (
    <>
      <Header />
      <Grid container justify="center" spacing={2}>
        <Grid container justify="center" item>
          <span>You are not authenticated!</span>
        </Grid>
        <Grid container justify="center" item>
          <span>Please authenticate using Internet Identity:</span>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: '130px', padding: 0 }}
          >
            Authenticate
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Auth;
