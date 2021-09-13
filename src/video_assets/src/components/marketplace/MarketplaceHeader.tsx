import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { headerStyles } from '../../styles/header_styles';
import logo from '../../assets/images/kryptonic_logo.png';
import history from '../History';

const MarketplaceHeader = () => {
  const classes = headerStyles();

  const onClickLink = (target: string) => {
    history.push(`/marketplace${target}`);
  };

  return (
    <Grid container justify="center" className={classes.outerHeaderContainer}>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.innerHeaderContainer}
      >
        <Grid item xs="auto">
          <img className={classes.logo} src={logo} alt="logo" />
        </Grid>
        <Grid item xs="auto">
          <Grid container alignItems="center">
            <Grid item>
              <Button onClick={() => onClickLink('/')}>Markets</Button>
            </Grid>
            <Grid item>
              <Button onClick={() => onClickLink('/dashboard')}>Dashboard</Button>
            </Grid>
            <Grid item>
              <Button onClick={() => onClickLink('/offers')}>Sell</Button>
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
      </Grid>
    </Grid>
  );
};

export default MarketplaceHeader;
