import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { headerStyles } from '../../styles/header_styles';
import logo from '../../assets/images/kryptonic_logo.png';
import history from '../History';
import { useLocation } from 'react-router-dom';
import ICPButton from '../ICPButton';

const MarketplaceHeader = () => {
  const classes = headerStyles();
  const location = useLocation();

  const onClickLink = (target: string) => {
    history.push(`/marketplace${target}`);
  };

  const isRouteActive = (name: string) => {
    return location.pathname.includes(name);
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
              <Button
                onClick={() => onClickLink('/markets')}
                className={isRouteActive('markets') ? classes.textButtonActive : classes.textButton}
              >
                Markets
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => onClickLink('/dashboard')}
                className={
                  isRouteActive('dashboard') ? classes.textButtonActive : classes.textButton
                }
              >
                Dashboard
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => history.push('/upload')} className={classes.textButton}>
                Video Platform
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs="auto">
          <ICPButton />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MarketplaceHeader;
