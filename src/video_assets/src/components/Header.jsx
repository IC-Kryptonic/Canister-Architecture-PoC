import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { headerStyles } from '../styles/header_styles';
import logo from '../assets/images/logo.svg';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import history from '../components/History';

const Header = () => {
  const classes = headerStyles();

  const onClickUploadButton = () => {
    history.push('/upload');
  };

  const onClickFeedButton = () => {
    history.push('/feed');
  };

  return (
    <Grid container justify="center" className={classes.outerHeaderContainer}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.innerHeaderContainer}
      >
        <Grid item md={10} xs="auto">
          <img className={classes.logo} src={logo} alt="logo" />
        </Grid>
        <Grid item>
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
          <img
            className="personal"
            src="https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
            alt="avatar"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
