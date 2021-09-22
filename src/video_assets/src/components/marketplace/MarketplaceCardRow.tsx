import { Paper, Grid, Button } from '@material-ui/core';
import React from 'react';
import { VideoToken } from '../../interfaces/token_interface';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';

interface MarketplaceCardProps {
  videoToken: VideoToken;
}

const MarketplaceCardRow = (props: MarketplaceCardProps) => {
  const classes = marketplaceHomeStyles();

  return (
    <Paper style={{ width: '100%', paddingTop: 15, paddingBottom: 15, marginBottom: 10 }}>
      <Grid container alignItems="center">
        <Grid item className={classes.videoCell}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <img src={props.videoToken.thumbnail} alt="thumbnail" className={classes.thumbnail} />
            </Grid>
            <Grid item xs={6}>
              {props.videoToken.name}
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tableCell}>
          {props.videoToken.marketCap}
        </Grid>
        <Grid item className={classes.tableCell}>
          {props.videoToken.sharePrice}
        </Grid>
        <Grid item className={classes.tableCell}>
          {props.videoToken.viewsLastWeek}
        </Grid>
        <Grid item className={classes.tableCell}>
          {props.videoToken.revenueLastWeek}
        </Grid>
        <Grid item className={classes.tableCell}>
          {props.videoToken.priceChangeLastWeek}
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
