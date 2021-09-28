import {Identity} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import {CreateProfilePost, LazyProfilePost} from "../interfaces/profile_interface";
import {Profile} from "../../../../.dfx/local/canisters/profile_backend/profile_backend.did";
import {getProfileBackendActor, getVideoCanisterActor} from "../utils/actors";

async function createProfile(identity: Identity, profilePost: CreateProfilePost){

  const profileBackend = await getProfileBackendActor(identity);

  let profile: Profile = {
    principal: await identity.getPrincipal(),
    name: profilePost.name,
    likes: [],
    comments: [],
    viewed: [],
  }

  await profileBackend.put_profile(profile);
}

async function getLazyUserProfile(identity: Identity, user_principal: Principal): Promise<LazyProfilePost>{
  return _getLazyProfile(identity, user_principal);
}

async function getLazyMyProfile(identity: Identity, ): Promise<LazyProfilePost>{
  return await _getLazyProfile(identity, await identity.getPrincipal());
}

async function addComment(identity: Identity, comment: string, videoPrincipal: Principal){
  const videoCanisterActor = await getVideoCanisterActor(identity, videoPrincipal);
  const profileBackend = await getProfileBackendActor(identity);

  await videoCanisterActor.add_commemnt(comment);
  await profileBackend.add_comment(videoPrincipal);
}

async function addLike(identity: Identity, videoPrincipal: Principal){
  const videoCanisterActor = await getVideoCanisterActor(identity, videoPrincipal);
  const profileBackend = await getProfileBackendActor(identity);

  await videoCanisterActor.add_like();
  await profileBackend.add_like(videoPrincipal);
}

async function getUserComments(identity: Identity, user: Principal): Promise<Array<string>>{
  const profileBackend = await getProfileBackendActor(identity);
  const commentedVideos = (await profileBackend.get_profile() as Profile).comments;

  const videoActors = commentedVideos.map((video) => {
    return getVideoCanisterActor(identity, video);
  });

  let comments = (await Promise.all(videoActors)).map((actor) => {
    return actor.get_comment(user) as Promise<string>;
  });

  return Promise.all(comments);
}

async function _getLazyProfile(identity: Identity, profile_principal: Principal): Promise<LazyProfilePost>{
  const profileBackend = await getProfileBackendActor(identity);

  let profile_result = await (await profileBackend.get_profile(profile_principal) as Promise<Profile>);

  return {
    principal: profile_result.principal,
    name: profile_result.name,
    likes: profile_result.likes,
    comments: profile_result.comments,
    viewed: profile_result.viewed,
  }
}

export { createProfile, getLazyMyProfile, getLazyUserProfile, addComment, addLike, getUserComments};
