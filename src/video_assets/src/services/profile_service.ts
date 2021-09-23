import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
    idlFactory as video_idl,
    canisterId as backendVideoId,
} from 'dfx-generated/backend';
import { Profile, ProfileUpdate } from '../interfaces/profile_interface';
import canisterIds from "../../../../.dfx/local/canister_ids.json"

import { getAuthenticatedIdentity } from './auth_services';

const agent = new HttpAgent();
const videoBackend = Actor.createActor(video_idl, {
  agent,
  canisterId: Principal.fromText(canisterIds.backend.local),
});

async function loadProfile(): Promise<Profile> {
    const principal = (await getAuthenticatedIdentity()).getPrincipal();

    let profileList = (await videoBackend.getCurrentProfile()) as Array<Profile>;

    //console.info(profileList);

    if (!profileList.length || profileList.length == 0) {
        console.info(`Profile for ${principal} does not exist! Creating new one`);
        await videoBackend.createProfile();

        profileList = (await videoBackend.getCurrentProfile()) as Array<Profile>;
    }

    return profileList[0];
}

async function updateProfile(update: ProfileUpdate) {
    await videoBackend.updateProfile(update);
}

async function getProfile(principal: Principal): Promise<Profile> {
    let profile = await videoBackend.getProfile(principal) as Array<Profile>;

    return profile[0];
}

async function getProfileLikes(postList: Array<String>) {
    let likesNr = 0;
    for(const post of postList) {
        let likes = Number(await videoBackend.getLikeAmount(post));
        likesNr += likes;
    }
    return likesNr;
}

async function getVideoLikes(videoId: String) {
    let likes = Number(await videoBackend.getLikeAmount(videoId));
    return likes;
}

async function likeVideo(videoId: String) {
    await videoBackend.likeVideo(videoId);   
} 

async function followProfile(principal: Principal) {
    await videoBackend.followProfile(principal);
}

async function unfollowProfile(principal: Principal) {
    await videoBackend.unfollowProfile(principal);
}

export {
    loadProfile,
    updateProfile,
    getProfile,
    getProfileLikes,
    likeVideo,
    getVideoLikes,
    followProfile,
    unfollowProfile
}