import React from 'react';
import { Grid } from '@material-ui/core';
import { headerStyles } from '../styles/header_styles';
import logo from '../assets/images/logo.svg';

const Header = () => {
  const classes = headerStyles();
  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className={classes.headerContainer}
    >
      <Grid item>
        <img className={classes.logo} src={logo} alt="logo" />
      </Grid>
      <Grid item>
        <img
          className="personal"
          src="https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg"
          alt="avatar"
        />
      </Grid>
    </Grid>
  );
};

export default Header;
