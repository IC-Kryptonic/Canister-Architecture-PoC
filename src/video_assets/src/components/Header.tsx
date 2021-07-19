import React from 'react';
import { Grid, Button, makeStyles } from '@material-ui/core';

import logo from '../assets/images/logo.svg';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import AccountCircle from '@material-ui/icons/AccountCircle';
import history from './History';

const headerStyles = makeStyles({
  logo_wrapper: {
    padding: 10,
    marginLeft: 20
  },
  logo: {
    height: 20,
  },
  profile: {
    width: 40,
    height: 40,
  }
});

const Header = () => {
  const classes = headerStyles();

  const onClickUploadButton = () => {
    history.push('/upload');
  };

  const onClickFeedButton = () => {
    history.push('/feed');
  };

  const onClickProfileButton = () => {
    history.push('/profile');
  }

  return (
    <Grid container justify="space-between" alignItems="center">
      <Grid item className={classes.logo_wrapper}>
        <img className={classes.logo} src={logo} alt="logo" />
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Grid item >
            <Button component="label" onClick={onClickFeedButton}>
              <DynamicFeedIcon />
            </Button>
          </Grid>
          <Grid item>
            <Button component="label" onClick={onClickUploadButton}>
              <CloudUploadIcon />
            </Button>
          </Grid>
          <Grid item>
            <Button component="label" onClick={onClickProfileButton}>
              <AccountCircle className={classes.profile}/>
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
