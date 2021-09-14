import { Button, Grid, Paper } from '@material-ui/core';
import React from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublicIcon from '@material-ui/icons/Public';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';
import { VideoToken } from '../../interfaces/token_interface';
import { mockVideoTokens } from '../../mocks/marketplace/videos';
import MarketplaceFooter from '../../components/marketplace/MarketplaceFooter';

const CardTableRow = ({ videoToken }: { videoToken: VideoToken }) => {
  const classes = marketplaceHomeStyles();

  return (
    <Paper style={{ width: '100%', paddingTop: 15, paddingBottom: 15, marginBottom: 10 }}>
      <Grid container alignItems="center">
        <Grid item className={classes.videoCell}>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <img src={videoToken.thumbnail} alt="thumbnail" className={classes.thumbnail} />
            </Grid>
            <Grid item xs={6}>
              {videoToken.name}
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tableCell}>
          {videoToken.marketCap}
        </Grid>
        <Grid item className={classes.tableCell}>
          {videoToken.sharePrice}
        </Grid>
        <Grid item className={classes.tableCell}>
          {videoToken.viewsLastWeek}
        </Grid>
        <Grid item className={classes.tableCell}>
          {videoToken.revenueLastWeek}
        </Grid>
        <Grid item className={classes.tableCell}>
          {videoToken.priceChangeLastWeek}
        </Grid>
        <Grid item className={classes.buttonCell}>
          <Grid container justify="center" spacing={1}>
            <Grid item xs={12}>
              <Button variant="contained" color="primary">
                Buy
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained">Sell</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const MarketplaceHome = () => {
  const classes = marketplaceHomeStyles();
  return (
    <>
      <div className={classes.background} />
      <MarketplaceHeader />
      <Grid container justify="center">
        <Grid container justify="center" spacing={2} className={classes.cards}>
          <Grid item>
            <MarketplaceStatCard
              title="Market Capitalization"
              value="$ 19,096,067,431.85"
              icon={PublicIcon}
            />
          </Grid>
          <Grid item>
            <MarketplaceStatCard title="Tokenized Videos" value="15,464" icon={PlayArrowIcon} />
          </Grid>
          <Grid item>
            <MarketplaceStatCard
              title="Total Views (last week)"
              value="13,464,434"
              icon={VisibilityIcon}
            />
          </Grid>
          <Grid item>
            <MarketplaceStatCard
              title="Payed Revenue (last week)"
              value="$ 1,204,402"
              icon={MonetizationOnIcon}
            />
          </Grid>
        </Grid>
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
            return <CardTableRow videoToken={videoToken} />;
          })}
        </Grid>
      </Grid>
      <MarketplaceFooter />
    </>
  );
};

export default MarketplaceHome;
