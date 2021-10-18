import { Button, CircularProgress, Grid, Paper } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import Layout from '../../components/shared/Layout';
import { VideoToken } from '../../interfaces/token_interface';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { TokenContext } from '../../contexts/TokenContext';
import { createShareOffer } from '../../services/token_services';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { countDecimals, nativeTokenDecimals } from '../../utils/tokens';
import { parseToDollar } from '../../utils/currency';

interface SelectOption {
  value: string;
  label: string;
}

interface SellParams {
  id: string | null;
}

function findId(id: string | null, tokens: Array<VideoToken>): SelectOption | null {
  if (!id || tokens.length < 1) {
    return null;
  }
  let result = tokens.find((token: VideoToken) => id === token.canisterId);
  if (!result) return null;
  return { label: result.name, value: result.canisterId };
}

const MarketplaceSell = () => {
  const { videoTokensForCreator, setTokenTrigger } = useContext(TokenContext);
  const { identity } = useContext(AuthContext);
  let { id } = useParams<SellParams>();

  const [selectedToken, setSelectedToken] = useState<SelectOption | null>(
    findId(id, videoTokensForCreator)
  );
  const [selectedAmount, setSelectedAmount] = useState<SelectOption | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [tokenOptions, setTokenOptions] = useState<Array<SelectOption>>([]);
  const [amountOptions, setAmountOptions] = useState<Array<SelectOption>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let options: Array<SelectOption> = [];
    for (let videoToken of videoTokensForCreator) {
      options.push({
        label: videoToken.name,
        value: videoToken.canisterId,
      });
    }
    setTokenOptions(options);
  }, [videoTokensForCreator]);

  useEffect(() => {
    if (!selectedToken || videoTokensForCreator.length < 1) return;
    let token = videoTokensForCreator.find(
      (element: VideoToken) => element.canisterId === selectedToken.value
    );

    // TODO hacky
    let amounts = Array.from({ length: parseInt(token.ownedAmount.toString()) }, (x, i) => i + 1);
    let amountsAsOptions = amounts.map((element: number) => {
      return { label: `${element}`, value: `${element}` };
    });
    setAmountOptions(amountsAsOptions);
  }, [selectedToken]);

  const onTokenValueChange = (value: SelectOption, { action, removedValue }: any) => {
    switch (action) {
      case 'select-option':
        setSelectedToken(value);
        break;
      default:
        setSelectedToken(null);
        break;
    }
  };

  const onAmountValueChange = (value: SelectOption, { action, removedValue }: any) => {
    switch (action) {
      case 'select-option':
        setSelectedAmount(value);
        break;
      default:
        setSelectedAmount(null);
        break;
    }
  };

  const onPriceChange = (value: string) => {
    if (value === '') {
      setPrice(null);
      return;
    }
    let newPrice = parseFloat(value);
    if (countDecimals(newPrice) <= nativeTokenDecimals) {
      setPrice(newPrice);
    }
  };

  const buttonEnabled = () => {
    return selectedToken && selectedAmount && price > 0 && !loading;
  };

  const createOffer = async () => {
    try {
      setLoading(true);
      const tokenToOffer = videoTokensForCreator.find(
        (element: VideoToken) => element.canisterId === selectedToken.value
      );
      await createShareOffer(
        identity,
        selectedToken.value,
        tokenToOffer.storageCanisterId,
        selectedToken.label,
        parseInt(selectedAmount.value),
        price
      );
      setTokenTrigger(true);
      toast.success(`Your tokens are available on the market now!`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('error creating offer on dex', error);
      toast.error(`Oops, something went wrong. Sorry!`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={'Dashboard'} marginTop={20} marketplaceHeader>
      <Grid container justify="center" style={{ marginTop: 40, fontSize: 32 }}>
        Sell
      </Grid>
      <Grid container justify="center" style={{ marginTop: 10 }}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid
            container
            item
            justify="center"
            style={{ marginBottom: 30, fontWeight: 300, fontSize: 22, color: 'grey' }}
          >
            Offer your video share tokens
          </Grid>
          <Paper style={{ padding: 30 }}>
            <Grid container item style={{ width: 500 }} spacing={2}>
              <Grid item xs={12}>
                <Select
                  value={selectedToken}
                  options={tokenOptions}
                  isClearable
                  placeholder="Select Video ..."
                  onChange={onTokenValueChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  value={selectedAmount}
                  options={amountOptions}
                  isClearable
                  placeholder="Define amount ..."
                  isDisabled={!selectedToken}
                  onChange={onAmountValueChange}
                />
              </Grid>
              <Grid container item xs={12} justify="space-between" alignItems="center">
                <Grid item xs={6}>
                  <input
                    value={price || ''}
                    onChange={(event) => onPriceChange(event.target.value)}
                    type="number"
                    placeholder="Price per share [ICP]"
                    style={{
                      width: '100%',
                      marginTop: 5,
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      fontWeight: 'inherit',
                      borderRadius: 4,
                      borderColor: 'rgb(204, 204, 204)',
                      padding: 5,
                      height: 41.5,
                    }}
                  />
                </Grid>
                <Grid item>
                  <p style={{ fontSize: 16 }}>{`$ ${parseToDollar(price)}`}</p>
                </Grid>
              </Grid>
              <Grid container item xs={12} justify="center">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: 150 }}
                  disabled={!buttonEnabled()}
                  onClick={() => createOffer()}
                >
                  {loading ? <CircularProgress /> : 'Create offer'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MarketplaceSell;
