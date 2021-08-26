import {Actor, ActorSubclass, HttpAgent} from '@dfinity/agent';
import {Principal} from '@dfinity/principal';
import {idlFactory as video_idl} from 'dfx-generated/backend';
import {idlFactory as bucket_idl} from 'dfx-generated/bucket';
import canisterIds from "../../../../.dfx/local/canister_ids.json"

import {Post, SimpleDHT_Storage_Type} from '../interfaces/video_interface';
import {Video_Info} from "../../../../.dfx/local/canisters/backend/backend.did";
import {Chunk} from "../../../../.dfx/local/canisters/bucket/bucket.did";

const agent = new HttpAgent();
const videoBackend = Actor.createActor(video_idl, {
  agent,
  canisterId: Principal.fromText(canisterIds.backend.local),
});

const maxChunkSize = 1024 * 500; // 500kb

async function loadDefaultFeed(count: number): Promise<Array<Post>> {
  return (await videoBackend.getDefaultFeed(count)) as Array<Post>;
}

async function loadVideo(videoInfo: Post): Promise<string> {
  const { video_id, storage_type} = videoInfo;
  let video_id_unpacked: string = video_id[0];

  let dht_info = storage_type as SimpleDHT_Storage_Type;

  let chunk_count: bigint = dht_info.simpleDistMap[0];
  let bucket_princ: Principal = dht_info.simpleDistMap[1][0];

  const bucketActor = Actor.createActor(
      bucket_idl
      , {
        agent: agent,
        canisterId: bucket_princ,
      });

  const chunkBuffers: Uint8Array[] | Buffer[] = [];
  const chunksAsPromises = [];
  for (let i = 0; i < chunk_count; i++) {
    chunksAsPromises.push(bucketActor.getChunk(video_id_unpacked, i));
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

function _processAndUploadChunk(
  videoBuffer: ArrayBuffer,
  byteStart: number,
  videoSize: number,
  videoId: string,
  chunkNum: number
) {
  const videoSlice = videoBuffer.slice(
    byteStart,
    Math.min(videoSize, byteStart + maxChunkSize)
  );
  const data = Array.from(new Uint8Array(videoSlice));


  let chunk = {
    "data" : data,
    "num" : chunkNum,
  };
  let videoData = {
    inCanister: chunk
  };

  return videoBackend.storeVideo(videoId, videoData);
}

function _processAndUploadChunkToBucket(
    videoBuffer: ArrayBuffer,
    byteStart: number,
    videoSize: number,
    id: string,
    chunkNum: number,
    bucketActor: ActorSubclass
) {
  const videoSlice = videoBuffer.slice(
      byteStart,
      Math.min(videoSize, byteStart + maxChunkSize)
  );
  const data = Array.from(new Uint8Array(videoSlice));


  let chunk = {
    "data" : data,
    "num" : chunkNum,
  };
  let videoData = {
    inCanister: chunk
  };

  return bucketActor.insertChunk(id, chunkNum, data)
}

async function uploadVideo(
  videoName: string,
  videoDescription: string,
  video: File
) {
  await agent.fetchRootKey();
  console.debug('starting upload');
  if (!video.size) {
    throw new Error('The video you are trying to upload has no size: ' + video);
  }
  const chunkCount = BigInt(Math.ceil(video.size / maxChunkSize));
  console.debug('chunkCount:', chunkCount, `timestamp: ${Date.now()}`);

  let videoInfo: Video_Info = {
    video_id: [],
    name: videoName,
    owner: Principal.anonymous(),
    creator: Principal.anonymous(),
    description: videoDescription,
    keywords: [],
    storage_type: { simpleDistMap : [chunkCount, []]},
  }

  const returnVideo = (await videoBackend.createVideo(
      videoInfo
  )) as Video_Info;

  console.debug('videoId:', returnVideo.video_id, `timestamp: ${Date.now()}`);

  const videoBuffer = (await video?.arrayBuffer()) || new ArrayBuffer(0);
  const putChunkPromises = [];

  const store_info = returnVideo.storage_type as SimpleDHT_Storage_Type;

  const bucketActor = Actor.createActor(
      bucket_idl
  , {
    agent: agent,
    canisterId: store_info.simpleDistMap[1][0],
  });

  console.debug('video info: ', returnVideo);

  let chunk = 0;
  for (
    let byteStart = 0;
    byteStart < video.size;
    byteStart += maxChunkSize, chunk++
  ) {
    putChunkPromises.push(
      _processAndUploadChunkToBucket(videoBuffer, byteStart, video.size, returnVideo.video_id[0], chunk, bucketActor)
    );
  }
  console.debug('starting to upload chunks', `timestamp: ${Date.now()}`);
  await Promise.all(putChunkPromises);
  console.debug('upload finished', `timestamp: ${Date.now()}`);
}

export { loadDefaultFeed, loadVideo, uploadVideo };
