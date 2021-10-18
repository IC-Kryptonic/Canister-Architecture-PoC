import { Paper, Grid, Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { TokenContext } from '../../contexts/TokenContext';
import { OffersByToken } from '../../interfaces/token_interface';
import { tokenStats } from '../../mocks/marketplace/tokenStats';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';
import { parseToDollar } from '../../utils/currency';
import history from '../History';

interface MarketplaceCardProps {
  offersByToken: OffersByToken;
}

const MarketplaceCardRow = (props: MarketplaceCardProps) => {
  const { showValuesInIcp } = useContext(TokenContext);
  const classes = marketplaceHomeStyles();

  const stats = tokenStats.get(props.offersByToken.tokenName);

  return (
    <Paper style={{ width: '100%', paddingTop: 15, paddingBottom: 15, marginBottom: 10 }}>
      <Grid container alignItems="center">
        <Grid item className={classes.videoCell}>
          {props.offersByToken.tokenName}
        </Grid>
        <Grid item className={classes.tableCell}>
          {stats
            ? showValuesInIcp
              ? stats.marketCap
              : `$ ${parseToDollar(stats.marketCap)}`
            : '-'}
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
          {stats
            ? showValuesInIcp
              ? stats.revenueLastWeek
              : `$ ${parseToDollar(stats.revenueLastWeek)}`
            : '-'}
        </Grid>
        <Grid item className={classes.tableCell}>
          {stats ? stats.priceChangeLastWeek : '-'}
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
