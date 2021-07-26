import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
    idlFactory as video_idl,
    canisterId as backendVideoId,
} from 'dfx-generated/backend';
import { Profile } from '../interfaces/profile_interface';
import { Post, Video_Data } from '../interfaces/video_interface';

import { getAuthenticatedIdentity } from './auth_services';

const agent = new HttpAgent();

agent.fetchRootKey();

const videoBackend = Actor.createActor(video_idl, {
    agent,
    canisterId: backendVideoId,
});

async function loadProfile(): Promise<Profile> {
    const principal = (await getAuthenticatedIdentity()).getPrincipal();

    let profileList = (await videoBackend.getCurrentProfile()) as Array<Profile>;

    console.info(profileList);

    if(!profileList.length || profileList.length == 0) {
        console.info(`Profile for ${principal} does not exist! Creating new one`);
        let newProfile: Profile = {
            principal: principal,
            name: principal.toText(),
            likes: []
        };
        await videoBackend.createProfile(newProfile);

        return newProfile;
    } else {
        return profileList[0];
    }
}

export {
    loadProfile
}