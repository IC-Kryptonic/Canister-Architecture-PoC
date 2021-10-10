import {Principal} from '@dfinity/principal';

import {VideoPost, CreateVideoPost} from '../interfaces/video_interface';
import {
  Chunk,
  VideoInfo,
  ChunkNum,
  Comment
} from "../../../../.dfx/local/canisters/video_backend/video_backend.did";
import {UserComment} from "../interfaces/profile_interface";
import {getLazyUserProfile} from "./profile_backend";
import {getProfileBackendActor, getVideoBackendActor, getVideoCanisterActor} from "../utils/actors";
import {ActorSubclass, Identity} from "@dfinity/agent";
import { getVideoFromCache, putVideoInCache } from './caching_service';

const maxChunkSize = 1024 * 500; // 500kb

async function loadRandomFeed(identity: Identity, count: number): Promise<Array<VideoPost>> {
  let videoBackend = await getVideoBackendActor(identity);
  console.debug('Callind random feed with identity', identity)
  let principals: Array<Principal> = await videoBackend.get_random_feed(count) as Array<Principal>;

  return _loadVideoPosts(identity, principals);
}

async function loadUserFeed(identity: Identity, count: number): Promise<Array<VideoPost>> {
  let videoBackend = await getVideoBackendActor(identity);
  let principals: Array<Principal> = await videoBackend.get_user_feed(count, await identity.getPrincipal()) as Array<Principal>;

  return _loadVideoPosts(identity, principals);
}

async function loadSearchFeed(identity: Identity, count: number, to_search: String): Promise<Array<VideoPost>> {
  let videoBackend = await getVideoBackendActor(identity);
  let principals: Array<Principal> = await videoBackend.get_search_feed(count, to_search) as Array<Principal>;

  return _loadVideoPosts(identity, principals);
}

async function loadCreatorFeed(identity: Identity, count: number, creator: Principal): Promise<Array<VideoPost>> {
  let videoBackend = await getVideoBackendActor(identity);
  let principals: Array<Principal> = await videoBackend.get_creator_feed(count, creator) as Array<Principal>;

  return _loadVideoPosts(identity, principals);
}

async function loadVideo(identity: Identity, videoInfo: VideoPost): Promise<string> {

  const {storageType} = videoInfo;
  let videoPrincipal = storageType.canister;
  let chunkCount = storageType.chunkCount;

  // If video is cached
  if(getVideoFromCache(videoPrincipal.toString())) {
    return getVideoFromCache(videoPrincipal.toString());
  }

  let videoActor = await getVideoCanisterActor(identity, videoPrincipal);

  const chunkBuffers: Uint8Array[] | Buffer[] = [];
  const chunksAsPromises = [];
  for (let i = 0; i < chunkCount; i++) {
    chunksAsPromises.push(videoActor.get_chunk(i));
  }
  const nestedBytes = (await Promise.all(chunksAsPromises))
    .map((val: Array<Chunk>) => {
      if (val[0] === undefined) {
        return null;
      } else {
        return val[0];
      }
    })
    .filter((v) => v !== null);
  nestedBytes.forEach((bytes) => {
    const bytesAsBuffer = Buffer.from(new Uint8Array(bytes));
    chunkBuffers.push(bytesAsBuffer);
  });
  const videoBlob = new Blob([Buffer.concat(chunkBuffers)], {
    type: 'video/mp4',
  });


  //Add view to profile backend
  let profileBackend = await getProfileBackendActor(identity);
  await profileBackend.add_view(videoPrincipal);

  let url = URL.createObjectURL(videoBlob);

  // Cache video
  putVideoInCache(videoPrincipal.toString(), url);

  return url;
}

async function loadVideoComments(identity: Identity, post: VideoPost, count: bigint): Promise<Array<UserComment>>{
  const {storageType} = post;
  let videoPrincipal = storageType.canister;
  let videoActor = await getVideoCanisterActor(identity, videoPrincipal);

  let comments = await videoActor.get_comments(count) as Array<Comment>;

  let profiles = comments.map( (comment) => {
    return getLazyUserProfile(identity, comment.commenter);
  });

  return (await Promise.all(profiles)).map(function(profile, i) {
    return {
      commenter: profile,
      comment: comments[i].text,
    }
  });

}

async function uploadVideo(identity: Identity,
    post: CreateVideoPost, save: Boolean, progressCallback: (current: number, total: number) => void
): Promise<Principal> {

  console.debug('starting upload');
  if (!post.video.size) {
    throw new Error('The video you are trying to upload has no size: ' + post.video);
  }
  const chunkCount = BigInt(Math.ceil(post.video.size / maxChunkSize));
  console.debug('chunkCount:', chunkCount, `timestamp: ${Date.now()}`);


  const thumbnailBuffer = (await post.thumbnail?.arrayBuffer()) || new ArrayBuffer(0);

  let videoInfo: VideoInfo = {
    storage_type: {canister: [chunkCount, []]},
    creator: await identity.getPrincipal(),
    thumbnail: Array.from(new Uint8Array(thumbnailBuffer)),
    views: BigInt(0),
    likes: BigInt(0),
    owner: await identity.getPrincipal(),
    name: post.name,
    description: post.description,
    keywords: post.keywords,
  };

  let videoBackend = await getVideoBackendActor(identity);

  console.debug("Creating Video:", videoInfo);
  const returnInfo = (await videoBackend.create_video(
      videoInfo, save
  )) as VideoInfo;

  let videoPrincipal = (returnInfo.storage_type as { 'canister' : [ChunkNum, [] | [Principal]] }).canister[1][0];
  console.debug('videoId:', videoPrincipal, `timestamp: ${Date.now()}`);

  const videoBuffer = (await post.video?.arrayBuffer()) || new ArrayBuffer(0);
  const putChunkPromises = [];

  let videoActor = await getVideoCanisterActor(identity, videoPrincipal);

  console.debug('video info: ', returnInfo);

  let chunk = 0;
  for (
      let byteStart = 0;
      byteStart < post.video.size;
      byteStart += maxChunkSize, chunk++
  ) {
    progressCallback(chunk + 1, Number(chunkCount));
    putChunkPromises.push(
        _processAndUploadChunkToCanister(videoBuffer, byteStart, post.video.size, chunk, videoActor)
    );
  }
  console.debug('starting to upload chunks', `timestamp: ${Date.now()}`);
  await Promise.all(putChunkPromises);
  console.debug('upload finished', `timestamp: ${Date.now()}`);

  return videoPrincipal;
}

async function loadVideoPost(identity: Identity, principal: Principal): Promise<VideoPost>{
  let videoActor = await getVideoCanisterActor(identity, principal);
  let videoInfo = await (await videoActor.get_info() as Promise<VideoInfo>);

  return _convertInfoToPost(videoInfo);
}

async function _loadVideoPosts(identity: Identity, principals: Array<Principal>): Promise<Array<VideoPost>>{

  const actor_promises: Array<Promise<ActorSubclass>> = [];
  principals.forEach( (principal) => {
    actor_promises.push(getVideoCanisterActor(identity, principal));
  });

  const info_promises = (await Promise.all(actor_promises)).map((actor) =>{
    return actor.get_info() as Promise<VideoInfo>
  })

  return (await Promise.all(info_promises)).map((video) =>{
    return _convertInfoToPost(video);
  });
}

function _processAndUploadChunkToCanister(
    videoBuffer: ArrayBuffer,
    byteStart: number,
    videoSize: number,
    chunkNum: number,
    videoActor: ActorSubclass
) {
  const videoSlice = videoBuffer.slice(
      byteStart,
      Math.min(videoSize, byteStart + maxChunkSize)
  );
  const data = Array.from(new Uint8Array(videoSlice));

  return videoActor.insert_chunk(chunkNum, data)
}

function _convertInfoToPost(info: VideoInfo): VideoPost{
  const thumbnailBlob = new Blob([Buffer.from(new Uint8Array(info.thumbnail))], {
    type: 'image/png',
  });

  let storage = (info.storage_type as { 'canister' : [ChunkNum, [] | [Principal]] }).canister;

  return{
    owner: info.owner,
    creator: info.creator,
    name: info.name,
    description: info.description,
    keywords: info.keywords,
    thumbnail: URL.createObjectURL(thumbnailBlob),
    views: info.views,
    likes: info.likes,
    storageType: {
      chunkCount: storage[0],
      canister: storage[1][0],
    },
  }
}

interface GetRandomNextVideoPostReturn {
  post: VideoPost,
  index: number
}

async function getRandomNextVideoPost(identity: Identity, videoId: number, sampleSize: number): Promise<GetRandomNextVideoPostReturn> {
  let posts = (await loadRandomFeed(identity, sampleSize));
  let index = Math.abs(videoId % Math.min(sampleSize, posts.length));
  return {
    post: posts[index],
    index: index
  };
}

export { loadCreatorFeed, loadRandomFeed, loadSearchFeed, loadUserFeed, loadVideo, uploadVideo, loadVideoComments, loadVideoPost, getRandomNextVideoPost};

