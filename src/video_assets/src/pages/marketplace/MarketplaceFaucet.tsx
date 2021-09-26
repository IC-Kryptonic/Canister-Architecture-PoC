import { Button, CircularProgress, Grid, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import { AuthContext } from '../../contexts/AuthContext';
import { receiveICPForIdentity } from '../../services/token_services';
import { TokenContext } from '../../contexts/TokenContext';

const MarketplaceFaucet = () => {
  const { isAuthenticated, identity } = useContext(AuthContext);
  const { setBalanceTrigger } = useContext(TokenContext);

  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const receiveICP = async () => {
    setLoading(true);
    try {
      await receiveICPForIdentity(amount, identity);
      setBalanceTrigger(true);
    } catch (error) {
      console.error('Error receiving kICP from faucet', error);
    } finally {
      setLoading(false);
    }
  };

  const buttonEnabled = () => {
    return amount > 0 && amount <= 100 && isAuthenticated && identity && !loading;
  };

  return (
    <>
      <MarketplaceHeader />
      <Grid container justify="center" style={{ marginTop: 40, fontSize: 32 }}>
        Kryptonic ICP (kICP) Faucet
      </Grid>
      <Grid container justify="center" style={{ marginTop: 30, fontSize: 22 }}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid container item justify="center" style={{ marginBottom: 30 }}>
            Receive kICP for our Kryptonik Internet Computer testnet
          </Grid>
          <Grid item>
            <TextField
              label="Amount [0, 100]"
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
              {loading ? <CircularProgress /> : 'Receive'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default MarketplaceFaucet;
