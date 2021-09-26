import { CircularProgress, Grid } from '@material-ui/core';
import React, { useContext } from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublicIcon from '@material-ui/icons/Public';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';
import MarketplaceFooter from '../../components/marketplace/MarketplaceFooter';
import MarketplaceCardRow from '../../components/marketplace/MarketplaceCardRow';
import { OffersByToken } from '../../interfaces/token_interface';
import { TokenContext } from '../../contexts/TokenContext';

const MarketplaceHome = () => {
  const { tokenOffers, offersLoading } = useContext(TokenContext);
  const classes = marketplaceHomeStyles();

  return (
    <>
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
              Share Price [min - max]
            </Grid>
            <Grid item className={classes.tableCell}>
              Offered shares
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
        {offersLoading && (
          <Grid container justify="center">
            <CircularProgress />
          </Grid>
        )}
        <Grid container></Grid>
        <Grid container className={classes.tableContent}>
          {tokenOffers.map((offersByToken: OffersByToken) => {
            return (
              <MarketplaceCardRow offersByToken={offersByToken} key={offersByToken.tokenName} />
            );
          })}
        </Grid>
      </Grid>
      <MarketplaceFooter />
    </>
  );
};

export default MarketplaceHome;
