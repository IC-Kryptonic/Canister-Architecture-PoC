import { Grid, Divider } from '@material-ui/core';
import React from 'react';

const MarketplaceFooter = () => {
  return (
    <Grid container justify="center" style={{ marginTop: 40, paddingBottom: 15 }}>
      <Grid item style={{ width: 500 }}>
        <Divider />
      </Grid>
      <Grid item xs={12} />
      <Grid item style={{ paddingTop: 15 }}>
        Copyright © 2021 Kryptonic
      </Grid>
    </Grid>
  );
};

export default MarketplaceFooter;
