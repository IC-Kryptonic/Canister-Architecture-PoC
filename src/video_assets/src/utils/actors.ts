import { Actor, ActorMethod, ActorSubclass, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as nativeTokenIdl } from 'dfx-generated/native_token';
import { idlFactory as tokenManagementIdl } from 'dfx-generated/token_management';
import { idlFactory as dexIdl } from 'dfx-generated/dex';
import {idlFactory as videoBackendIdl} from 'dfx-generated/video_backend';
import {idlFactory as videoCanisterIdl} from 'dfx-generated/video_canister';
import {idlFactory as profileBackendIdl} from 'dfx-generated/profile_backend';
import {idlFactory as adManagerIdl} from 'dfx-generated/ad_manager';
import canisterIds from '../../../../.dfx/local/canister_ids.json';

let _identity: null | Identity = null;
let _httpAgent: null | HttpAgent = null;
let _nativeTokenActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;
let _tokenManagementActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null =
  null;
let _dexActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;
let _videoBackendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;
let _adManagerActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;
let _profileBackendActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;

export const getHttpAgent = async (identity: Identity) => {
  if (!_httpAgent || identity !== _identity) {
    // should be: new HttpAgent({ identity });
    _identity = identity;
    _httpAgent = new HttpAgent({identity});
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

export const getVideoBackendActor = async (identity: Identity) => {
  if (!_videoBackendActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _videoBackendActor = Actor.createActor(videoBackendIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.video_backend.local),
    });
  }
  return _videoBackendActor;
};

export const getAdManagerActor = async (identity: Identity) => {
  if (!_adManagerActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _adManagerActor = Actor.createActor(adManagerIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.ad_manager.local),
    });
  }
  return _adManagerActor;
};

export const getProfileBackendActor = async (identity: Identity) => {
  if (!_profileBackendActor || identity !== _identity) {
    const httpAgent = await getHttpAgent(identity);
    _profileBackendActor = Actor.createActor(profileBackendIdl, {
      agent: httpAgent,
      canisterId: Principal.fromText(canisterIds.profile_backend.local),
    });
  }
  return _profileBackendActor;
};

export const getVideoCanisterActor = async (identity: Identity, principal: Principal) => {
  const httpAgent = await getHttpAgent(identity);
  return Actor.createActor(videoCanisterIdl, {
    agent: httpAgent,
    canisterId: principal,
  });
};
