import { Paper, Grid, Card } from '@material-ui/core';
import React, { useContext } from 'react';
import { TokenContext } from '../contexts/TokenContext';
import { useCurrencySwitchStyles } from '../styles/currency_switch_styles';
import InternetIdentityLogo from '../assets/images/internet_identity_logo.svg';
import DollarLogo from '../assets/images/dollar.png';

const CurrencySwitch = () => {
  const { showValuesInIcp, setShowValuesInIcp } = useContext(TokenContext);
  const classes = useCurrencySwitchStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={6}>
          <Card
            className={showValuesInIcp ? classes.selectedCard : classes.unselectedCard}
            onClick={() => !showValuesInIcp && setShowValuesInIcp(true)}
          >
            <Grid container justify="center" className={classes.text} alignItems="center">
              <Grid item>ICP</Grid>
              <Grid item>
                <img
                  src={InternetIdentityLogo}
                  alt="ii-logo"
                  height="20px"
                  className={classes.logo}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            className={!showValuesInIcp ? classes.selectedCard : classes.unselectedCard}
            onClick={() => showValuesInIcp && setShowValuesInIcp(false)}
          >
            <Grid
              container
              spacing={1}
              justify="center"
              className={classes.text}
              alignItems="center"
            >
              <Grid item>USD</Grid>
              <Grid item>
                <img src={DollarLogo} alt="dollar-logo" height="20px" className={classes.logo} />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CurrencySwitch;
