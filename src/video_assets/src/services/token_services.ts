import { Actor, ActorMethod, ActorSubclass, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as nativeTokenIdl } from 'dfx-generated/native_token';
import canisterIds from '../../../../.dfx/local/canister_ids.json';

let _identity: null | Identity = null;
let _httpAgent: null | HttpAgent = null;
let _nativeTokenActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>> | null = null;

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
      //@ts-ignore
      canisterId: Principal.fromText(canisterIds.native_token.local),
    });
  }
  return _nativeTokenActor;
};

export const getBalanceForIdentity = async (identity: Identity): Promise<Number> => {
  const actor = await getNativeTokenActor(identity);
  const principal = identity.getPrincipal();

  const result = (await actor.balance({
    token: '',
    user: { principal },
  })) as BigIntResult;
  console.log(result);
  if ('ok' in result) return Number(result.ok);
  throw new Error(JSON.stringify(result));
};
