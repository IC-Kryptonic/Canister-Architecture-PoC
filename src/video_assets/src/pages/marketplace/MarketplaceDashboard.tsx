import { Button, Card, Grid, Paper } from '@material-ui/core';
import React from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublicIcon from '@material-ui/icons/Public';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';
import { VideoToken } from '../../interfaces/token_interface';
import { mockVideoTokens } from '../../mocks/marketplace/videos';
import MarketplaceFooter from '../../components/marketplace/MarketplaceFooter';
import { PieChart } from 'react-minimal-pie-chart';
import { marketplaceStatStyles } from '../../styles/marketplace/marketplace_stat_styles';

const MarketplaceDashboard = () => {
  const classes = marketplaceHomeStyles();
  const statClasses = marketplaceStatStyles();
  return (
    <>
      <div className={classes.background} />
      <MarketplaceHeader />
      <Grid container justify="center">
        <Grid container justify="center" spacing={2} className={classes.cards}>
          <Grid item>
            <Grid item>
              <MarketplaceStatCard
                title="Video Views (last week)"
                value="1,464,434"
                icon={VisibilityIcon}
              />
            </Grid>
            <Grid item>
              <MarketplaceStatCard
                title="Earned Revenue (last week)"
                value="$ 19,096"
                icon={MonetizationOnIcon}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Card className={statClasses.card}>
              <Grid container alignItems="center" justify="center" spacing={1}>
                <Grid item>
                  <Grid container item className={statClasses.title}>
                    Total Revenue by Video Title
                  </Grid>
                  <Grid container item justify="center">
                    <PieChart
                      data={[
                        { title: 'One', value: 10, color: '#E38627' },
                        { title: 'Two', value: 15, color: '#C13C37' },
                        { title: 'Three', value: 20, color: '#6A2135' },
                      ]}
                      style={{ paddingTop: 15, height: 85 }}
                      animate={true}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <MarketplaceFooter />
    </>
  );
};

export default MarketplaceDashboard;
