import { Button, CircularProgress, Grid, Paper } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/shared/Layout';
import { ExchangeInput, OffersByToken } from '../../interfaces/token_interface';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { TokenContext } from '../../contexts/TokenContext';
import { realizeExchange } from '../../services/token_services';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { parseToDollar } from '../../utils/currency';
import { useMarketplaceBuyStyles } from '../../styles/marketplace/marketplace_buy_styles';
import { selectOffers } from '../../utils/tokens';

interface SelectOption {
  value: string;
  label: string;
}

interface SellParams {
  id: string | null;
}

function findId(id: string | null, tokens: Array<OffersByToken>): OffersByToken | null {
  if (!id || tokens.length < 1) {
    return null;
  }
  let result = tokens.find((token: OffersByToken) => id === token.canisterId);
  return result;
}

const MarketplaceBuy = () => {
  const classes = useMarketplaceBuyStyles();
  const { tokenOffers, setTokenTrigger, setBalanceTrigger, nativeTokenBalance } =
    useContext(TokenContext);
  const { identity } = useContext(AuthContext);
  let { id } = useParams<SellParams>();

  const [offersByToken, setOffersByToken] = useState<OffersByToken>(findId(id, tokenOffers));
  const [selectedAmount, setSelectedAmount] = useState<SelectOption | null>(null);
  const [exchangeInput, setExchangeInput] = useState<ExchangeInput | null>(null);
  const [amountOptions, setAmountOptions] = useState<Array<SelectOption>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!offersByToken) return;

    let amounts = Array.from(
      { length: parseInt(offersByToken.offeredAmount.toString()) },
      (x, i) => i + 1
    );
    let amountsAsOptions = amounts.map((element: number) => {
      return { label: `${element}`, value: `${element}` };
    });
    setAmountOptions(amountsAsOptions);
  }, []);

  const onAmountValueChange = (value: SelectOption, { action, removedValue }: any) => {
    switch (action) {
      case 'select-option':
        setSelectedAmount(value);
        try {
          setExchangeInput(selectOffers(identity, offersByToken, parseInt(value.value)));
        } catch (error) {
          console.error('Error finding matching offers for desired token amount', error);
          toast.error(`Error finding matching offers for desired token amount!`, {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: true,
          });
        }
        break;
      default:
        setSelectedAmount(null);
        break;
    }
  };

  const buttonEnabled = () => {
    return (
      !loading && selectedAmount && exchangeInput && nativeTokenBalance >= exchangeInput.totalPrice
    );
  };

  const buyShares = async () => {
    try {
      setLoading(true);
      await realizeExchange(identity, exchangeInput);
      setBalanceTrigger(true);
      setTokenTrigger(true);
      toast.success(`Successfully purchased ${selectedAmount.value} share tokens`, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error('error realizing exchange on dex', error);
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
      <Grid container justify="center" className={classes.title}>
        Buy
      </Grid>
      <Grid container justify="center" className={classes.outerContainer}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid container item justify="center" className={classes.subtitle}>
            Acquire video share tokens
          </Grid>
          <Paper className={classes.paper}>
            <Grid container item className={classes.paperContainer} spacing={2}>
              <Grid item xs={12}>
                {offersByToken?.tokenName}
              </Grid>
              <Grid item xs={12}>
                <Select
                  value={selectedAmount}
                  options={amountOptions}
                  isClearable
                  placeholder="Define amount ..."
                  isDisabled={!offersByToken}
                  onChange={onAmountValueChange}
                />
              </Grid>
              <Grid container item xs={12} justify="space-between" alignItems="center">
                <Grid item xs={6}>
                  <input
                    value={exchangeInput ? `${exchangeInput.totalPrice} ICP` : ''}
                    disabled
                    type="string"
                    placeholder="Price per share"
                    className={classes.priceInput}
                  />
                </Grid>
                <Grid item>
                  <p className={classes.priceInDollar}>{`$ ${
                    exchangeInput ? parseToDollar(exchangeInput.totalPrice) : '0'
                  }`}</p>
                </Grid>
              </Grid>
              <Grid container item xs={12} justify="center">
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  disabled={!buttonEnabled()}
                  onClick={() => buyShares()}
                >
                  {loading ? <CircularProgress /> : 'Buy shares'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MarketplaceBuy;
