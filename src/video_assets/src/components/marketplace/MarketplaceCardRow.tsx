import { Paper, Grid, Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { TokenContext } from '../../contexts/TokenContext';
import { OffersByToken } from '../../interfaces/token_interface';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';
import { parseToDollar } from '../../utils/currency';
import history from '../History';

interface MarketplaceCardProps {
  offersByToken: OffersByToken;
}

const MarketplaceCardRow = (props: MarketplaceCardProps) => {
  const { showValuesInIcp } = useContext(TokenContext);
  const classes = marketplaceHomeStyles();

  return (
    <Paper style={{ width: '100%', paddingTop: 15, paddingBottom: 15, marginBottom: 10 }}>
      <Grid container alignItems="center">
        <Grid item className={classes.videoCell}>
          {props.offersByToken.tokenName}
        </Grid>
        <Grid item className={classes.tableCell}>
          {showValuesInIcp ? 2 : `$ ${parseToDollar(2)}`}
        </Grid>
        <Grid item className={classes.tableCell}>
          {showValuesInIcp
            ? props.offersByToken.minPrice + ' - ' + props.offersByToken.maxPrice
            : `$ ${parseToDollar(props.offersByToken.minPrice)} -
                ${parseToDollar(props.offersByToken.maxPrice)}`}
        </Grid>
        <Grid item className={classes.tableCell}>
          {`${props.offersByToken.offeredAmount}`}
        </Grid>
        <Grid item className={classes.tableCell}>
          {showValuesInIcp ? 5 : `$ ${parseToDollar(5)}`}
        </Grid>
        <Grid item className={classes.tableCell}>
          {showValuesInIcp ? 7 : `$ ${parseToDollar(7)}`}
        </Grid>
        <Grid item className={classes.buttonCell}>
          <Grid container justify="center" spacing={1}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  history.push(`/marketplace/buy/${props.offersByToken.offers[0].token}`)
                }
              >
                Buy
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MarketplaceCardRow;
