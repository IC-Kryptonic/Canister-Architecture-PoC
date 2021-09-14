import { Button, Grid, Paper } from '@material-ui/core';
import React from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublicIcon from '@material-ui/icons/Public';
import RonaldoThumbnail from '../../assets/images/thumbnail_ronaldo.png';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';

const CardTableRow = () => {
  const classes = marketplaceHomeStyles();

  return (
    <Paper style={{ width: '100%', paddingTop: 15, paddingBottom: 15, marginBottom: 10 }}>
      <Grid container alignItems="center">
        <Grid item className={classes.videoCell}>
          <Grid container alignItems="center">
            <Grid item>
              <img src={RonaldoThumbnail} alt="thumbnail" className={classes.thumbnail} />
            </Grid>
            <Grid item>Name</Grid>
          </Grid>
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
        <Grid item className={classes.buttonCell}>
          <Button variant="contained">Details</Button>
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
          <CardTableRow />
        </Grid>
      </Grid>
    </>
  );
};

export default MarketplaceHome;
