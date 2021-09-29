import React from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
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
    <Grid container justify="space-between" alignItems="center" className={classes.container}>
      <Grid item className={classes.logo_wrapper}>
        <Button component="label" onClick={() => onClickLink('/markets')} className={classes.logo_button}>
          <img className={classes.logo} src={logo} alt="logo" />
        </Button>
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Button
              onClick={() => onClickLink('/markets')}
              className={isRouteActive('markets') ? classes.textButtonActive : classes.textButton}
            >
              <Typography align="center" variant="subtitle2" color="primary"><b>Markets</b></Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => onClickLink('/dashboard')}
              className={
                isRouteActive('dashboard') ? classes.textButtonActive : classes.textButton
              }
            >
               <Typography align="center" variant="subtitle2" color="primary"><b>Dashboard</b></Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => history.push('/upload')} className={classes.textButton}>
            <Typography align="center" variant="subtitle2" color="primary"><b>Video Platform</b></Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs="auto">
        <div className={classes.icpButton}>
          <ICPButton />
        </div>
      </Grid>
    </Grid >
  );
};

export default MarketplaceHeader;
