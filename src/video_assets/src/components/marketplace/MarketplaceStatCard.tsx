import { Card, Grid, SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import React from 'react';
import { marketplaceStatStyles } from '../../styles/marketplace/marketplace_stat_styles';

interface MarketplaceStatCardProps {
  title: string;
  value: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
}

const MarketplaceStatCard = (props: MarketplaceStatCardProps) => {
  const classes = marketplaceStatStyles();
  return (
    <Card className={classes.card}>
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <Grid container item className={classes.title}>
            {props.title}
          </Grid>
          <Grid container item className={classes.value}>
            {props.value}
          </Grid>
        </Grid>
        <Grid item>
          <props.icon color="secondary"></props.icon>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MarketplaceStatCard;
