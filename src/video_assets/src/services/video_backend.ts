import {Actor, ActorSubclass, HttpAgent} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import {idlFactory as videoBackend_idl} from 'dfx-generated/video_backend';
import {idlFactory as videoCanister_idl} from 'dfx-generated/video_canister';
import canisterIds from "../../../../.dfx/local/canister_ids.json"

import {Post, CreatePost, CanisterStorage} from '../interfaces/video_interface';
import {
  Chunk,
  VideoInfo,
  StorageType,
  ChunkNum
} from "../../../../.dfx/local/canisters/video_canister/video_canister.did";

const agent = new HttpAgent();
const videoBackend = Actor.createActor(videoBackend_idl, {
  agent,
  canisterId: Principal.fromText(canisterIds.backend.local),
});

const maxChunkSize = 1024 * 500; // 500kb

async function loadRandomFeed(count: number): Promise<Array<Post>> {
  let principals: Array<Principal> = await videoBackend.get_random_feed(count) as Array<Principal>;

  return _loadVideoPosts(principals);
}

async function loadUserFeed(count: number): Promise<Array<Post>> {
  let principals: Array<Principal> = await videoBackend.get_user_feed(count, await agent.getPrincipal()) as Array<Principal>;

  return _loadVideoPosts(principals);
}

async function loadSearchFeed(count: number, to_search: String): Promise<Array<Post>> {
  let principals: Array<Principal> = await videoBackend.get_search_feed(count, to_search) as Array<Principal>;

  return _loadVideoPosts(principals);
}

async function loadCreatorFeed(count: number, creator: Principal): Promise<Array<Post>> {
  let principals: Array<Principal> = await videoBackend.get_creator_feed(count, creator) as Array<Principal>;

  return _loadVideoPosts(principals);
}

async function loadVideo(videoInfo: Post): Promise<string> {
  const {storageType} = videoInfo;
  let videoPrincipal = storageType.canister;
  let chunkCount = storageType.chunkCount;

  let videoActor = _createVideoActor(videoPrincipal);

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

  return URL.createObjectURL(videoBlob);
}

async function uploadVideo(
    post: CreatePost, save: Boolean
): Promise<Principal> {

  await agent.fetchRootKey();

  console.debug('starting upload');
  if (!post.video.size) {
    throw new Error('The video you are trying to upload has no size: ' + post.video);
  }
  const chunkCount = BigInt(Math.ceil(post.video.size / maxChunkSize));
  console.debug('chunkCount:', chunkCount, `timestamp: ${Date.now()}`);

  let storage: StorageType = {
    'canister': [chunkCount, null]
  }

  const thumbnailBuffer = (await post.thumbnail?.arrayBuffer()) || new ArrayBuffer(0);

  let videoInfo: VideoInfo = {
    name: post.name,
    owner: null,
    creator: await agent.getPrincipal(),
    description: post.description,
    keywords: post.keywords,
    storage_type: storage,
    likes: BigInt(0),
    thumbnail: Array.from(new Uint8Array(thumbnailBuffer)),
    views: BigInt(0),
  }

  const returnInfo = (await videoBackend.create_video(
      videoInfo, save
  )) as VideoInfo;

  let video_principal = (returnInfo.storage_type as { 'canister' : [ChunkNum, [] | [Principal]] }).canister[1][0];
  console.debug('videoId:', video_principal, `timestamp: ${Date.now()}`);

  const videoBuffer = (await post.video?.arrayBuffer()) || new ArrayBuffer(0);
  const putChunkPromises = [];

  const video_actor = _createVideoActor(video_principal);

  console.debug('video info: ', returnInfo);

  let chunk = 0;
  for (
      let byteStart = 0;
      byteStart < post.video.size;
      byteStart += maxChunkSize, chunk++
  ) {
    putChunkPromises.push(
        _processAndUploadChunkToCanister(videoBuffer, byteStart, post.video.size, chunk, video_actor)
    );
  }
  console.debug('starting to upload chunks', `timestamp: ${Date.now()}`);
  await Promise.all(putChunkPromises);
  console.debug('upload finished', `timestamp: ${Date.now()}`);

  return video_principal;
}

async function _loadVideoPosts(principals: Array<Principal>): Promise<Array<Post>>{

  const promises: Array<Promise<Post>> = [];
  principals.forEach( (principal) => {
    const canisterActor = _createVideoActor(principal);

    promises.push(canisterActor.get_info() as Promise<Post>);
  })

  return await Promise.all(promises);
}

function _processAndUploadChunkToCanister(
    videoBuffer: ArrayBuffer,
    byteStart: number,
    videoSize: number,
    chunkNum: number,
    bucketActor: ActorSubclass
) {
  const videoSlice = videoBuffer.slice(
      byteStart,
      Math.min(videoSize, byteStart + maxChunkSize)
  );
  const data = Array.from(new Uint8Array(videoSlice));

  return bucketActor.insert_chunk(chunkNum, data)
}



function _createVideoActor(principal: Principal): ActorSubclass{
  return Actor.createActor(
      videoCanister_idl
      , {
        agent: agent,
        canisterId: principal,
      });
}

export { loadCreatorFeed, loadRandomFeed, loadSearchFeed, loadUserFeed, loadVideo, uploadVideo};
