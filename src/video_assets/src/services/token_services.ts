import { Actor, ActorMethod, ActorSubclass, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as nativeTokenIdl } from 'dfx-generated/native_token';
import { idlFactory as tokenManagementIdl } from 'dfx-generated/token_management';
import canisterIds from '../../../../.dfx/local/canister_ids.json';
import { VideoToken, VideoTokenResult } from '../interfaces/token_interface';

let _identity: null | Identity = null;
let _httpAgent: null | HttpAgent = null;
let _nativeTokenActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;
let _tokenManagementActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null =
  null;

type BigIntResult = {
  ok: BigInt;
};

const getHttpAgent = async (identity: Identity) => {
  if (!_httpAgent || identity !== _identity) {
    // should be: new HttpAgent({ identity });
    _httpAgent = new HttpAgent();
    await _httpAgent.fetchRootKey();
  }
  return _httpAgent;
};

const getNativeTokenActor = async (identity: Identity) => {
  if (!_nativeTokenActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _nativeTokenActor = Actor.createActor(nativeTokenIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.native_token.local),
    });
  }
  return _nativeTokenActor;
};

const getTokenManagementActor = async (identity: Identity) => {
  if (!_tokenManagementActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _tokenManagementActor = Actor.createActor(tokenManagementIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.token_management.local),
    });
  }
  return _tokenManagementActor;
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

export async function getAllTokens(identity: Identity): Promise<Array<VideoToken>> {
  const tokenBackend = await getTokenManagementActor(identity);
  const result = (await tokenBackend.getAllTokens()) as Array<VideoTokenResult>;
  return parseTokenResult(result);
}

export async function getTokensForCreator(identity: Identity): Promise<Array<VideoToken>> {
  const tokenBackend = await getTokenManagementActor(identity);
  const principal = identity.getPrincipal().toText();
  const result = (await tokenBackend.getTokensForCreator(principal)) as Array<VideoTokenResult>;
  return parseTokenResult(result);
}

function parseTokenResult(result: Array<VideoTokenResult>): Array<VideoToken> {
  const parsedResult: Array<VideoToken> = [];
  for (let entry of result) {
    const metadata = JSON.parse(entry.metadata);
    parsedResult.push({
      name: entry.name,
      canisterId: entry.canisterId,
      supply: entry.supply,
      ...metadata,
    });
  }
  return parsedResult;
}
