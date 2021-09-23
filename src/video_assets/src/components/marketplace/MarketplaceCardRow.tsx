import { Paper, Grid, Button } from '@material-ui/core';
import React from 'react';
import { OffersByToken } from '../../interfaces/token_interface';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';

interface MarketplaceCardProps {
  offersByToken: OffersByToken;
}

const MarketplaceCardRow = (props: MarketplaceCardProps) => {
  const classes = marketplaceHomeStyles();

  return (
    <Paper style={{ width: '100%', paddingTop: 15, paddingBottom: 15, marginBottom: 10 }}>
      <Grid container alignItems="center">
        <Grid item className={classes.videoCell}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <img src="" alt="thumbnail" className={classes.thumbnail} />
            </Grid>
            <Grid item xs={6}>
              {props.offersByToken.tokenName}
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tableCell}>
          {'$ 253,343'}
        </Grid>
        <Grid item className={classes.tableCell}>
          {props.offersByToken.minPrice + ' - ' + props.offersByToken.maxPrice}
        </Grid>
        <Grid item className={classes.tableCell}>
          {`${props.offersByToken.offeredAmount}`}
        </Grid>
        <Grid item className={classes.tableCell}>
          {'50,000'}
        </Grid>
        <Grid item className={classes.tableCell}>
          {'$ 7043'}
        </Grid>
        <Grid item className={classes.buttonCell}>
          <Grid container justify="center" spacing={1}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
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
