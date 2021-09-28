import React from 'react';
import { Grid, Button, makeStyles } from '@material-ui/core';

import logo from '../assets/images/kryptonic_logo.png';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import history from './History';

import Search from './shared/Search';

import { PurpleColor } from '../styles/shared_styles';

const headerStyles = makeStyles({
  container: {
    maxHeight: '15vh',
    //borderBottom: `1px solid ${PurpleColor}`
    backgroundColor: "white"
  },
  logo_wrapper: {
    padding: 10,
    marginLeft: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
  },
  logo: {
    height: 40,
  },
  logo_button: {
    marginTop: 0,
    padding: 0
  },
  icon_color: {
    color: PurpleColor
  },
  profile: {
    width: 40,
    height: 40,
    color: PurpleColor
  },
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
  };

  const onClickMarketplaceButton = () => {
    history.push('/marketplace/markets');
  };

  return (
    <Grid container justify="space-between" alignItems="center" className={classes.container}>
      <Grid item className={classes.logo_wrapper}>
        <Button component="label" onClick={onClickFeedButton} className={classes.logo_button}>
          <img className={classes.logo} src={logo} alt="logo" />
        </Button>
      </Grid>
      <Grid item>
        <Search />
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Button component="label" onClick={onClickMarketplaceButton} className={classes.headerButton}>
              <MonetizationOnIcon className={classes.icon_color} />
            </Button>
          </Grid>
          <Grid item>
            <Button component="label" onClick={onClickFeedButton} className={classes.headerButton}>
              <DynamicFeedIcon className={classes.icon_color} />
            </Button>
          </Grid>
          <Grid item>
            <Button component="label" onClick={onClickUploadButton} className={classes.headerButton}>
              <CloudUploadIcon className={classes.icon_color} />
            </Button>
          </Grid>
          <Grid item>
            <Button component="label" onClick={onClickProfileButton}>
              <AccountCircle className={classes.profile} />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
