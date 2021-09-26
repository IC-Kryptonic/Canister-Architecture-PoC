import { Actor, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as nativeTokenIdl } from 'dfx-generated/native_token';
import {
  OffersByToken,
  VideoToken,
  VideoTokenOffer,
  VideoTokenResult,
} from '../interfaces/token_interface';
import {
  getNativeTokenActor,
  getHttpAgent,
  getTokenManagementActor,
  getDexActor,
} from '../utils/actors';
import canisterIds from '../../../../.dfx/local/canister_ids.json';
import { parseOffers, parseTokenResult } from '../utils/tokens';
import { CreateVideoPost } from '../interfaces/video_interface';

type BigIntResult = {
  ok: BigInt;
};

export const createToken = async (
  identity: Identity,
  video: Principal,
  post: CreateVideoPost,
  shareAmount: number
) => {
  const storageCanisterId = video.toText();
  const tokenBackend = await getTokenManagementActor(identity);
  const principal = identity.getPrincipal();
  const metadata = JSON.stringify({
    storageCanisterId,
    description: post.description,
    // TODO set creator with name
    creator: identity,
  });
  await tokenBackend.createToken(principal.toText(), post.name, '', 2, shareAmount, metadata);
};

export const getBalanceForIdentity = async (identity: Identity): Promise<Number> => {
  const actor = await getNativeTokenActor(identity);
  const principal = identity.getPrincipal();

  const result = (await actor.balance({
    token: '',
    user: { principal },
  })) as BigIntResult;
  if ('ok' in result) return Number(result.ok);
  throw new Error(JSON.stringify(result));
};

export const getShareBalanceForIdentity = async (
  identity: Identity,
  canisterId: string
): Promise<Number> => {
  const httpAgent = await getHttpAgent(identity);
  const tokenActor = Actor.createActor(nativeTokenIdl, {
    agent: httpAgent,
    canisterId: Principal.fromText(canisterId),
  });
  const principal = identity.getPrincipal();

  const result = (await tokenActor.balance({
    token: '',
    user: { principal },
  })) as BigIntResult;
  if ('ok' in result) return Number(result.ok);
  throw new Error(JSON.stringify(result));
};

export const receiveICPForIdentity = async (
  amount: number,
  identity: Identity
): Promise<Number> => {
  const actor = await getNativeTokenActor(identity);
  const principal = identity.getPrincipal();

  const result = (await actor.acquireFromFaucet({
    from: { principal },
    to: { principal },
    token: '',
    amount: amount,
    memo: [],
    notify: false,
    subaccount: [],
  })) as BigIntResult;
  if ('ok' in result) return Number(result.ok);
  throw new Error(JSON.stringify(result));
};

export const createShareOffer = async (
  identity: Identity,
  canisterId: string,
  tokenName: string,
  amount: number,
  price: number
) => {
  const dexActor = await getDexActor(identity);
  const httpAgent = await getHttpAgent(identity);
  const tokenActor = Actor.createActor(nativeTokenIdl, {
    agent: httpAgent,
    canisterId: Principal.fromText(canisterId),
  });
  const dexPrincipal = Principal.fromText(canisterIds.dex.local);
  const identityPrincipal = identity.getPrincipal();

  // allow dex to transfer the token on video token canister
  await tokenActor.approve(identityPrincipal, dexPrincipal, amount);
  // create offer on dex canister
  await dexActor.createOffer(identityPrincipal, canisterId, tokenName, price, amount);
};

export const realizeExchange = async (
  identity: Identity,
  offers: Array<VideoTokenOffer>,
  amount: number
) => {
  const dexActor = await getDexActor(identity);
  const nativeTokenActor = await getNativeTokenActor(identity);
  const tokenBackend = await getTokenManagementActor(identity);
  const dexPrincipal = Principal.fromText(canisterIds.dex.local);
  const identityPrincipal = identity.getPrincipal();

  // TODO determine which offers must be realized
  let offer = offers[0];
  // allow dex to transfer the token on video token canister
  await nativeTokenActor.approve(
    identityPrincipal,
    dexPrincipal,
    amount * parseInt(offer.pricePerShare.toString())
  );
  // realize exchanges on dex canister for each offer
  await dexActor.realizeExchange(
    identityPrincipal,
    offer.from,
    offer.canisterId,
    offer.pricePerShare,
    offer.shareAmount
  );
  // change ownership
  await tokenBackend.changeOwnership(offer.from, offer.canisterId, -offer.shareAmount);
  await tokenBackend.changeOwnership(identityPrincipal, offer.canisterId, offer.shareAmount);
};

export const getAllOffers = async (identity: Identity): Promise<VideoTokenOffer[]> => {
  const dexActor = await getDexActor(identity);
  return (await dexActor.getAllOffers()) as Array<VideoTokenOffer>;
};

export const getAllOffersByToken = async (identity: Identity): Promise<OffersByToken[]> => {
  const dexActor = await getDexActor(identity);
  const result = (await dexActor.getAllOffers()) as Array<VideoTokenOffer>;
  return parseOffers(result);
};

export async function getAllTokens(identity: Identity): Promise<Array<VideoToken>> {
  const tokenBackend = await getTokenManagementActor(identity);
  const result = (await tokenBackend.getAllTokens()) as Array<VideoTokenResult>;
  return parseTokenResult(result);
}

export async function getTokensForCreator(identity: Identity): Promise<Array<VideoToken>> {
  const tokenBackend = await getTokenManagementActor(identity);
  const principal = identity.getPrincipal().toText();
  const result = (await tokenBackend.getOwnedTokens(principal)) as Array<VideoTokenResult>;
  return parseTokenResult(result);
}
