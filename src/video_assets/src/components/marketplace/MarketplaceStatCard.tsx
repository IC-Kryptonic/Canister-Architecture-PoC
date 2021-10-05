import { Card, Grid, SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React from 'react';
import { marketplaceStatStyles } from '../../styles/marketplace/marketplace_stat_styles';

interface MarketplaceStatCardProps {
  title: string;
  value: string;
  img: string;
}

const MarketplaceStatCard = (props: MarketplaceStatCardProps) => {
  const classes = marketplaceStatStyles();
  return (
    <Card className={classes.card}>
      <Grid container alignItems="center" justify="space-between" className={classes.container}>
        <Grid container justify="space-between" alignItems="center" item xs={12}>
          <Grid container item xs={8}>
            <Grid container item xs={12} className={classes.title}>
              {props.title}
            </Grid>
            <Grid container item xs={12} className={classes.value}>
              {props.value}
            </Grid>
          </Grid>
          <Grid item>
            <img src={props.img} alt="globe" style={{ height: 50 }} />
          </Grid>
        </Grid>
        <Grid container item className={classes.footer}>
          <span className={classes.footerHighlight}>{'+ 3,2%'}</span>
          {'from last week'}
        </Grid>
      </Grid>
    </Card>
  );
};

export default MarketplaceStatCard;
