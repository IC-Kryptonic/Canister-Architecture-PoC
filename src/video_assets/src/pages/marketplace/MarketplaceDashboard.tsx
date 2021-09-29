import { Button, Card, Grid, CircularProgress } from '@material-ui/core';
import React, { useContext } from 'react';
import Layout from '../../components/shared/Layout';
import { marketplaceDashboardStyles } from '../../styles/marketplace/marketplace_dashboard_styles';
import { VideoToken } from '../../interfaces/token_interface';
import { marketplaceStatStyles } from '../../styles/marketplace/marketplace_stat_styles';
import { TokenContext } from '../../contexts/TokenContext';
import history from '../../components/History';
import chart from '../../assets/images/mock/chart1.png';
import yourWeek from '../../assets/images/mock/your_week.png';

const MarketplaceDashboard = () => {
  const { videoTokensForCreator, videoMap, dashboardLoading } = useContext(TokenContext);

  const classes = marketplaceDashboardStyles();
  const statClasses = marketplaceStatStyles();

  return (
    <Layout title={'Dashboard'} marginTop={20} marketplaceHeader>
      <Grid container justify="center">
        <Grid container justify="center" style={{ marginTop: 20, fontSize: 32 }}>
          Your week
        </Grid>
        <Grid container justify="center" style={{ marginTop: 20, fontSize: 32 }}>
          <img src={yourWeek} alt="weekly stats" style={{ width: 800, pointerEvents: 'none' }} />
        </Grid>
        <Grid container justify="center" style={{ marginTop: 30, fontSize: 32 }}>
          Your video shares
        </Grid>
        {dashboardLoading && (
          <Grid container justify="center">
            <CircularProgress style={{ marginTop: 30 }} />
          </Grid>
        )}
        <Grid container justify="space-around" spacing={2} className={classes.cards}>
          {videoTokensForCreator.map((videoToken: VideoToken) => {
            let video = videoMap.map.get(videoToken.storageCanisterId);
            return (
              <React.Fragment key={videoToken.canisterId}>
                <Grid item xs={8}>
                  <Card style={{ marginBottom: 20, height: 300, width: '100%' }}>
                    <Grid container>
                      <Grid item xs="auto" style={{ minWidth: 200 }}>
                        {video ? (
                          <video controls style={{ height: 300, maxWidth: 300 }}>
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
                <Grid item xs={3}>
                  <Card>
                    <img
                      src={chart}
                      alt="chart"
                      style={{
                        width: 350,
                        height: 300,
                        objectFit: 'contain',
                        pointerEvents: 'none',
                      }}
                    />
                  </Card>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MarketplaceDashboard;
