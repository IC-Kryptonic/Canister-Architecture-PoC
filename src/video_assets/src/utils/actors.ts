import { Actor, ActorMethod, ActorSubclass, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as nativeTokenIdl } from 'dfx-generated/native_token';
import { idlFactory as tokenManagementIdl } from 'dfx-generated/token_management';
import { idlFactory as dexIdl } from 'dfx-generated/dex';
import canisterIds from '../../../../.dfx/local/canister_ids.json';

let _identity: null | Identity = null;
let _httpAgent: null | HttpAgent = null;
let _nativeTokenActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;
let _tokenManagementActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null =
  null;
let _dexActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;

export const getHttpAgent = async (identity: Identity) => {
  if (!_httpAgent || identity !== _identity) {
    // should be: new HttpAgent({ identity });
    _httpAgent = new HttpAgent();
    await _httpAgent.fetchRootKey();
  }
  return _httpAgent;
};

export const getNativeTokenActor = async (identity: Identity) => {
  if (!_nativeTokenActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _nativeTokenActor = Actor.createActor(nativeTokenIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.native_token.local),
    });
  }
  return _nativeTokenActor;
};

export const getTokenManagementActor = async (identity: Identity) => {
  if (!_tokenManagementActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _tokenManagementActor = Actor.createActor(tokenManagementIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.token_management.local),
    });
  }
  return _tokenManagementActor;
};

export const getDexActor = async (identity: Identity) => {
  if (!_dexActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _dexActor = Actor.createActor(dexIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.dex.local),
    });
  }
  return _dexActor;
};
