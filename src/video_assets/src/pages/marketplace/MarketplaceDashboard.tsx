import { Button, Card, Grid, CircularProgress } from '@material-ui/core';
import React, { useContext } from 'react';
import Layout from '../../components/shared/Layout';
import { marketplaceDashboardStyles } from '../../styles/marketplace/marketplace_dashboard_styles';
import { VideoToken } from '../../interfaces/token_interface';
import { TokenContext } from '../../contexts/TokenContext';
import history from '../../components/History';
import globe from '../../assets/images/globe.svg';
import money from '../../assets/images/money.svg';
import eye from '../../assets/images/eye.svg';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';
import MarketplaceTable from '../../components/marketplace/MarketplaceTable';

const MarketplaceDashboard = () => {
  const { videoTokensForCreator, videoMap, dashboardLoading } = useContext(TokenContext);

  const classes = marketplaceDashboardStyles();

  return (
    <Layout title={'Dashboard'} marginTop={20} marketplaceHeader>
      <Grid container justify="center">
        <Grid container justify="center" style={{ marginTop: 20, fontSize: 32 }}>
          Your week in numbers
        </Grid>
        <Grid container justify="center">
          <Grid container justify="center" spacing={2} className={classes.cards}>
            <Grid item>
              <MarketplaceStatCard
                title="Market Capitalization"
                value="$ 19,096,067,431.85"
                img={globe}
              />
            </Grid>
            <Grid item>
              <MarketplaceStatCard title="Total Views (last week)" value="13,464,434" img={eye} />
            </Grid>
            <Grid item>
              <MarketplaceStatCard
                title="Payed Revenue (last week)"
                value="$ 1,204,402"
                img={money}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container justify="center" style={{ marginTop: 30, fontSize: 32 }}>
          Your video shares
        </Grid>
        {dashboardLoading ? (
          <Grid container justify="center">
            <CircularProgress style={{ marginTop: 30 }} />
          </Grid>
        ) : !dashboardLoading && videoTokensForCreator.length > 0 ? (
          <Grid
            container
            justify="center"
            spacing={2}
            className={classes.cards}
            style={{ paddingLeft: 80 }}
          >
            {videoTokensForCreator.map((videoToken: VideoToken) => {
              let video = videoMap.map.get(videoToken.storageCanisterId);
              return (
                <React.Fragment key={videoToken.canisterId}>
                  <Grid container alignItems="center">
                    <Grid item style={{ width: 700 }}>
                      <Card style={{ marginBottom: 20, height: 290, width: '100%' }}>
                        <Grid container>
                          <Grid item xs="auto" style={{ minWidth: 200 }}>
                            {video ? (
                              <video controls style={{ height: 290, maxWidth: 300 }}>
                                <source src={video} type="video/mp4" />
                              </video>
                            ) : (
                              '...'
                            )}
                          </Grid>
                          <Grid item xs={7} style={{ padding: 15 }}>
                            <Grid item xs={12} className={classes.factTitle}>
                              Title:
                            </Grid>
                            <Grid item xs={12} className={classes.factValue}>
                              {videoToken.name}
                            </Grid>
                            <Grid item xs={12} className={classes.factTitle}>
                              Creator:
                            </Grid>
                            <Grid item xs={12} className={classes.factValue}>
                              Seeder
                            </Grid>
                            <Grid item xs={12} className={classes.factTitle}>
                              Shares (owned shares / existing shares):
                            </Grid>
                            <Grid item xs={12} className={classes.factValue}>
                              {`${videoToken.ownedAmount} / ${videoToken.supply}`}
                            </Grid>
                            <Grid item xs={12} className={classes.factTitle}>
                              Create an offer:
                            </Grid>
                            <Grid item xs={12} className={classes.factValue}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  history.push(`/marketplace/sell/${videoToken.canisterId}`)
                                }
                              >
                                Sell
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                    <Grid item style={{ width: 500, height: 290 }}>
                      <div style={{ paddingTop: 86 }}>
                        <MarketplaceTable />
                      </div>
                    </Grid>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        ) : (
          <Grid container justify="center" style={{ marginTop: 50 }}>
            You don't own any video shares yet.
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default MarketplaceDashboard;
