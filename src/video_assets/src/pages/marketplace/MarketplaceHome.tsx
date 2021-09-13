import { Grid } from '@material-ui/core';
import React from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';

const MarketplaceHome = () => {
  return (
    <>
      <MarketplaceHeader />
      <Grid container justify="center" spacing={2}>
        <Grid item>
          <MarketplaceStatCard
            title="Market Capitalization"
            value="$ 19,096,067,431.85"
            icon={MonetizationOnIcon}
          />
        </Grid>
        <Grid item>
          <MarketplaceStatCard title="Tokenized Videos" value="15,464" icon={PlayArrowIcon} />
        </Grid>
        <Grid item>
          <MarketplaceStatCard
            title="Total Views (this week)"
            value="13,464,434"
            icon={VisibilityIcon}
          />
        </Grid>
        <Grid item>
          <MarketplaceStatCard
            title="Payed Revenue (this week)"
            value="$ 1,204,402"
            icon={VisibilityIcon}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default MarketplaceHome;
