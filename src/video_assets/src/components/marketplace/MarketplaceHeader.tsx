import React from 'react';
import { Grid, Button, Typography, Divider } from '@material-ui/core';
import { headerStyles } from '../../styles/header_styles';
import logo from '../../assets/images/kryptonic_logo.png';
import history from '../History';
import { useLocation } from 'react-router-dom';
import ICPButton from '../ICPButton';

interface MarketplaceHeaderProps {
  showLogo: boolean;
}

const MarketplaceHeader = (props: MarketplaceHeaderProps) => {
  const classes = headerStyles();
  const location = useLocation();

  const onClickLink = (target: string) => {
    history.push(`/marketplace${target}`);
  };

  const isRouteActive = (isMarketplaceRoute: boolean) => {
    if (isMarketplaceRoute) {
      return location.pathname.includes('marketplace');
    } else {
      return !location.pathname.includes('marketplace');
    }
  };

  return (
    <Grid container justify="space-between" alignItems="center" className={classes.container}>
      <Grid item className={classes.logo_wrapper}>
        {props.showLogo && (
          <Button
            component="label"
            onClick={() => onClickLink('/markets')}
            className={classes.logo_button}
          >
            <img className={classes.logo} src={logo} alt="logo" />
          </Button>
        )}
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Button
              onClick={() => history.push('/feed')}
              className={isRouteActive(false) ? classes.textButtonActive : classes.textButton}
            >
              Video Platform
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => onClickLink('/markets')}
              className={isRouteActive(true) ? classes.textButtonActive : classes.textButton}
            >
              Marketplace
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs="auto">
        <div className={classes.icpButton}>
          <ICPButton />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};

export default MarketplaceHeader;
