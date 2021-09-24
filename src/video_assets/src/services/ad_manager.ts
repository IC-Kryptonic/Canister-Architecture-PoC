import {Actor, HttpAgent} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import {idlFactory as videoBackend_idl} from 'dfx-generated/video_backend';
import {idlFactory as videoCanister_idl} from 'dfx-generated/video_canister';
import {idlFactory as adManager_idl} from 'dfx-generated/ad_manager'
import canisterIds from "../../../../.dfx/local/canister_ids.json"

import {AdPost, CreateAdPost} from '../interfaces/ad_interface';
import {CanisterStorage} from "../interfaces/video_interface";
import {VideoInfo} from "../../../../.dfx/local/canisters/ad_manager/ad_manager.did";

import {uploadVideo, loadVideo} from "./video_backend";
import {ChunkNum} from "../../../../.dfx/local/canisters/video_canister/video_canister.did";

const agent = new HttpAgent();
const adManager = Actor.createActor(adManager_idl, {
  agent,
  canisterId: Principal.fromText(canisterIds.ad_manager.local),
})


async function createAd(post: CreateAdPost){
  let created_principal = await uploadVideo(post, false);

  await adManager.add_ad(created_principal);
}

async function loadRandomAdPost(): Promise<AdPost> {

  let maybe_ad_principal = await adManager.getRandomAdPrincipal() as [Principal];
  let ad_principal = maybe_ad_principal[0];
  if (ad_principal === undefined) {
    console.error("No ad uploaded yet")
    return;
  }

  return _loadAdPostFromCanister(ad_principal);
}

async function loadTargetedAdPost(): Promise<AdPost>{
  let maybe_ad_principal = await adManager.get_ad_principal_for_user(agent.getPrincipal()) as [Principal];
  let ad_principal = maybe_ad_principal[0];
  if (ad_principal === undefined) {
    console.error("No ad uploaded yet")
    return;
  }

  return _loadAdPostFromCanister(ad_principal);
}

async function loadAdVideo(post: AdPost): Promise<string>{
  return loadVideo(post);
}


async function _loadAdPostFromCanister(principal: Principal): Promise<AdPost>{
  const adActor = Actor.createActor(
      videoCanister_idl,
      {
        agent: agent,
        canisterId: principal,
      }
  );

  let adInfo = await adActor.getInfo() as VideoInfo;

  let canisterStore = adInfo.storage_type as { 'canister' : [ChunkNum, [] | [Principal]] };
  let storage: CanisterStorage = {
    chunkCount: canisterStore.canister[0],
    canister: canisterStore.canister[1][0],
  }

  const thumbnailBlob = new Blob([Buffer.from(new Uint8Array(adInfo.thumbnail))], {
    type: 'image/png',
  });

  return {
    creator: adInfo.creator,
    description: adInfo.description,
    keywords: adInfo.keywords,
    likes: adInfo.likes,
    name: adInfo.name,
    storageType: storage,
    thumbnail: URL.createObjectURL(thumbnailBlob),
    views: adInfo.views,
    owner: adInfo.owner,
  }
}


export { createAd, loadRandomAdPost, loadTargetedAdPost, loadAdVideo};
