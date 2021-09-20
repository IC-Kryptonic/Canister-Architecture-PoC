import { Button, Grid, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import { marketplaceHomeStyles } from '../../styles/marketplace/marketplace_home_styles';
import MarketplaceFooter from '../../components/marketplace/MarketplaceFooter';
import { AuthContext } from '../../contexts/AuthContext';
import { receiveICPForIdentity } from '../../services/token_services';

const MarketplaceFaucet = () => {
  const { isAuthenticated, identity } = useContext(AuthContext);

  const classes = marketplaceHomeStyles();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const receiveICP = async () => {
    setLoading(true);
    try {
      const result = await receiveICPForIdentity(amount, identity);
      // trigger balance reload
    } catch (error) {
      console.error('Error receiving kICP from faucet', error);
    } finally {
      setLoading(false);
    }
  };

  const buttonEnabled = () => {
    return amount > 0 && amount <= 10 && isAuthenticated && identity;
  };

  return (
    <>
      <div className={classes.background} />
      <MarketplaceHeader />
      <Grid container justify="center" style={{ marginTop: 40, fontSize: 32 }}>
        Kryptonice ICP (kICP) Faucet
      </Grid>
      <Grid container justify="center" style={{ marginTop: 30, fontSize: 22 }}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid container item justify="center" style={{ marginBottom: 30 }}>
            Receive kICP for our Kryptonik Internet Computer testnet
          </Grid>
          <Grid item>
            <TextField
              label="Amount [0, 10]"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(event) => setAmount(parseFloat(event.target.value))}
              style={{ backgroundColor: 'white' }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={!buttonEnabled()}
              onClick={() => receiveICP()}
            >
              Receive
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <MarketplaceFooter />
    </>
  );
};

export default MarketplaceFaucet;
