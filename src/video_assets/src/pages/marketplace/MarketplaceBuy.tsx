import { Button, Grid } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import MarketplaceHeader from '../../components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '../../components/marketplace/MarketplaceFooter';
import { OffersByToken, VideoToken, VideoTokenOffer } from '../../interfaces/token_interface';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { TokenContext } from '../../contexts/TokenContext';
import { createShareOffer, realizeExchange } from '../../services/token_services';
import { AuthContext } from '../../contexts/AuthContext';
import { Principal } from '@dfinity/principal';

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
  const { tokenOffers } = useContext(TokenContext);
  const { identity } = useContext(AuthContext);
  let { id } = useParams<SellParams>();

  const [offersByToken, setOffersByToken] = useState<OffersByToken>(findId(id, tokenOffers));
  console.log(tokenOffers);
  const [selectedAmount, setSelectedAmount] = useState<SelectOption | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [amountOptions, setAmountOptions] = useState<Array<SelectOption>>([]);

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
        // TODO actually calculate the total price
        setPrice(parseInt(value.value) * parseInt(offersByToken.minPrice.toString()));
        break;
      default:
        setSelectedAmount(null);
        break;
    }
  };

  const buttonEnabled = () => {
    return selectedAmount && price > 0;
  };

  const buyShares = async () => {
    try {
      await realizeExchange(identity, offersByToken.offers, parseInt(selectedAmount.value));
    } catch (error) {
      console.error('error realizing exchange on dex', error);
    }
  };

  return (
    <>
      <MarketplaceHeader />
      <Grid container justify="center" style={{ marginTop: 40, fontSize: 32 }}>
        Buy
      </Grid>
      <Grid container justify="center" style={{ marginTop: 10 }}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Grid
            container
            item
            justify="center"
            style={{ marginBottom: 30, fontWeight: 300, fontSize: 22, color: 'grey' }}
          >
            Acquire video share tokens
          </Grid>
          <Grid
            container
            item
            style={{ width: 500, border: '1px solid grey', borderRadius: 5 }}
            spacing={2}
          >
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
                  value={price}
                  disabled
                  type="number"
                  placeholder="Price per share"
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
              <Grid item>Current average: 1,32 kICP</Grid>
            </Grid>
            <Grid container item xs={12} justify="center">
              <Button
                variant="contained"
                color="primary"
                style={{ width: 150 }}
                disabled={!buttonEnabled()}
                onClick={() => buyShares()}
              >
                Buy shares
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MarketplaceFooter />
    </>
  );
};

export default MarketplaceBuy;
