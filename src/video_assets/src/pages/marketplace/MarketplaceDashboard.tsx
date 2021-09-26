import { Button, Card, Grid, CircularProgress } from '@material-ui/core';
import React, { useContext } from 'react';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceStatCard from '../../components/marketplace/MarketplaceStatCard';
import { marketplaceDashboardStyles } from '../../styles/marketplace/marketplace_dashboard_styles';
import { VideoToken } from '../../interfaces/token_interface';
import MarketplaceFooter from '../../components/marketplace/MarketplaceFooter';
import MarketplaceChart from '../../components/marketplace/MarketplaceChart';
import { PieChart } from 'react-minimal-pie-chart';
import { marketplaceStatStyles } from '../../styles/marketplace/marketplace_stat_styles';
import { TokenContext } from '../../contexts/TokenContext';
import history from '../../components/History';

const MarketplaceDashboard = () => {
  const { videoTokensForCreator, videoMap, dashboardLoading } = useContext(TokenContext);

  const classes = marketplaceDashboardStyles();
  const statClasses = marketplaceStatStyles();

  return (
    <>
      <div className={classes.background} />
      <MarketplaceHeader />
      <Grid container justify="center">
        <Grid container justify="center" style={{ marginTop: 20, fontSize: 32 }}>
          Your weekly overview
        </Grid>
        <Grid container justify="center" spacing={2} className={classes.cards}>
          <Grid item>
            <Grid item>
              <MarketplaceStatCard title="Video Views" value="1,464,434" icon={VisibilityIcon} />
            </Grid>
            <Grid item>
              <MarketplaceStatCard
                title="Earned Revenue"
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
        <Grid container justify="center" style={{ marginTop: 30, fontSize: 32 }}>
          Your video shares
        </Grid>
        {dashboardLoading && (
          <Grid container justify="center">
            <CircularProgress />
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
                          <CircularProgress />
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
                  <MarketplaceChart width={350} height={300} />
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </Grid>
      <MarketplaceFooter />
    </>
  );
};

export default MarketplaceDashboard;
