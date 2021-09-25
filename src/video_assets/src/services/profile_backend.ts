import {Actor, HttpAgent} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import {idlFactory as profileBackend_idl} from 'dfx-generated/profile_backend';
import canisterIds from "../../../../.dfx/local/canister_ids.json"
import {CreateProfilePost, LazyProfilePost} from "../interfaces/profile_interface";
import {Profile} from "../../../../.dfx/local/canisters/profile_backend/profile_backend.did";
import {createVideoActor} from "./video_backend";

const agent = new HttpAgent();
const profileBackend = Actor.createActor(profileBackend_idl, {
  agent,
  canisterId: Principal.fromText(canisterIds.profile_backend.local),
});

async function createProfile(profilePost: CreateProfilePost){

  await agent.fetchRootKey();

  let profile: Profile = {
    principal: await agent.getPrincipal(),
    name: profilePost.name,
    likes: [],
    comments: [],
    viewed: [],
  }

  await profileBackend.put_profile(profile);
}

async function getLazyUserProfile(user_principal: Principal): Promise<LazyProfilePost>{
  return _getLazyProfile(user_principal);
}

async function getLazyMyProfile(): Promise<LazyProfilePost>{
  let profile = await _getLazyProfile(await agent.getPrincipal());
  if(!profile.principal) {
    let principal = await agent.getPrincipal();
    await createProfile({ 
      name: principal.toString()
    });
    profile = await _getLazyProfile(await agent.getPrincipal());
  }
  return profile;
}

async function addComment(comment: string, videoPrincipal: Principal){
  let videoCanisterActor = createVideoActor(videoPrincipal);

  await videoCanisterActor.add_commemnt(comment);
  await profileBackend.add_comment(videoPrincipal);
}

async function addLike(videoPrincipal: Principal){
  let videoCanisterActor = createVideoActor(videoPrincipal);

  await videoCanisterActor.add_like();
  await profileBackend.add_like(videoPrincipal);
}

async function getUserComments(user: Principal): Promise<Array<string>>{
  let commentedVideos = (await profileBackend.get_profile() as Profile).comments;

  let comments = commentedVideos.map((video) => {
    let video_actor = createVideoActor(video);
    return video_actor.get_comment(user) as Promise<string>;
  });

  return Promise.all(comments)
}

async function _getLazyProfile(profile_principal: Principal): Promise<LazyProfilePost>{
  let profile_result = (await (profileBackend.get_profile(profile_principal) as Promise<Profile[]>))[0];

  if (profile_result === undefined){
    console.log('No profile found for', `${Date.now()}`);
    return {
      principal: profile_principal,
      name: profile_principal.toString(),
      likes: [],
      comments: [],
      viewed: [],
    }
  }

  return {
    principal: profile_result.principal,
    name: profile_result.name,
    likes: profile_result.likes,
    comments: profile_result.comments,
    viewed: profile_result.viewed,
  }
}


export { createProfile, getLazyMyProfile, getLazyUserProfile, addComment, addLike, getUserComments};
