import { Grid } from '@material-ui/core';
import React from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublicIcon from '@material-ui/icons/Public';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';
import { mockVideoTokens } from '../../mocks/marketplace/videos';
import MarketplaceFooter from '../../components/marketplace/MarketplaceFooter';
import MarketplaceCardRow, { RowType } from '../../components/marketplace/MarketplaceCardRow';

const MarketplaceSell = () => {
  const classes = marketplaceHomeStyles();
  return (
    <>
      <div className={classes.background} />
      <MarketplaceHeader />
      <Grid container justify="center" style={{ marginTop: 30, fontSize: 32 }}>
        Sell your tokens to investors
      </Grid>
      <Grid container justify="center">
        <Grid container className={classes.table}>
          {/* table header */}
          <Grid container>
            <Grid item className={classes.videoCell}>
              Video
            </Grid>
            <Grid item className={classes.tableCell}>
              Market Cap.
            </Grid>
            <Grid item className={classes.tableCell}>
              Share Price
            </Grid>
            <Grid item className={classes.tableCell}>
              Views (last week)
            </Grid>
            <Grid item className={classes.tableCell}>
              Revenues (last week)
            </Grid>
            <Grid item className={classes.tableCell}>
              Price change (last week)
            </Grid>
            <Grid item className={classes.buttonCell}></Grid>
          </Grid>
        </Grid>
        {/* table content */}
        <Grid container className={classes.tableContent}>
          {mockVideoTokens.map((videoToken) => {
            return <MarketplaceCardRow videoToken={videoToken} rowType={RowType.SELL} />;
          })}
        </Grid>
      </Grid>
      <MarketplaceFooter />
    </>
  );
};

export default MarketplaceSell;
