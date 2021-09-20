import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import canisterIds from '../../../../.dfx/local/canister_ids.json';
import { idlFactory as nativeTokenIdl } from 'dfx-generated/native_token';

let _identity: null | Identity = null;
let _httpAgent: null | HttpAgent = null;
let _nativeTokenActor: null | Actor = null;

const getHttpAgent = async (identity: Identity) => {
  if (!_httpAgent || identity !== _identity) {
    _httpAgent = new HttpAgent({ identity });
    await _httpAgent.fetchRootKey();
  }
  return _httpAgent;
};

const getNativeTokenActor = async (identity: Identity) => {
  if (!_nativeTokenActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _nativeTokenActor = Actor.createActor(nativeTokenIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.backend.local),
    });
  }
  return _nativeTokenActor;
};

export const getBalanceForIdentity = async (identity: Identity) => {
  const nativeTokenActor = await getNativeTokenActor(identity);
  const balance = await nativeTokenActor.balance();
  return balance;
};
