import {Principal} from '@dfinity/principal';

import {AdPost, CreateAdPost} from '../interfaces/ad_interface';
import {CanisterStorage} from "../interfaces/video_interface";
import {VideoInfo} from "../../../../.dfx/local/canisters/ad_manager/ad_manager.did";

import {uploadVideo, loadVideo} from "./video_backend";
import {ChunkNum} from "../../../../.dfx/local/canisters/video_canister/video_canister.did";
import {Identity} from "@dfinity/agent";
import {getAdManagerActor, getVideoCanisterActor} from "../utils/actors";


async function createAd(identity: Identity, post: CreateAdPost){
  let created_principal = await uploadVideo(identity, post, false, (current: number, total: number) => {});

  const adManager = await getAdManagerActor(identity);
  await adManager.add_ad(created_principal);
}

async function loadRandomAdPost(identity: Identity): Promise<AdPost> {
  const adManager = await getAdManagerActor(identity);

  let maybe_ad_principal = await adManager.getRandomAdPrincipal() as [Principal];
  let ad_principal = maybe_ad_principal[0];
  if (ad_principal === undefined) {
    console.error("No ad uploaded yet")
    return;
  }

  return _loadAdPostFromCanister(identity, ad_principal);
}

async function loadTargetedAdPost(identity: Identity): Promise<AdPost>{
  const adManager = await getAdManagerActor(identity);

  let maybe_ad_principal = await adManager.get_ad_principal_for_user(identity.getPrincipal()) as [Principal];
  let ad_principal = maybe_ad_principal[0];
  if (ad_principal === undefined) {
    console.error("No ad uploaded yet")
    return;
  }

  return _loadAdPostFromCanister(identity, ad_principal);
}

async function loadAdVideo(identity: Identity, post: AdPost): Promise<string>{
  return loadVideo(identity, post);
}

async function _loadAdPostFromCanister(identity: Identity, principal: Principal): Promise<AdPost>{
  const adActor = await getVideoCanisterActor(identity, principal);

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
