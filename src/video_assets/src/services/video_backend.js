import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  idlFactory as video_idl,
  canisterId as backendVideoId,
} from 'dfx-generated/backend';

const agent = new HttpAgent();
const videoBackend = Actor.createActor(video_idl, {
  agent,
  canisterId: backendVideoId,
});
const maxChunkSize = 1024 * 500; // 500kb

async function loadDefaultFeed(count) {
  const feed = await videoBackend.getDefaultFeed(count);
  return feed;
}


async function loadVideo(videoInfo) {
  const { video_id, storage_type} = videoInfo;
  let video_id_unpacked = video_id[0];

  let chunk_count = storage_type.inCanister;

  const chunkBuffers = [];
  const chunksAsPromises = [];
  for (let i = 0; i <= Number(chunk_count.toString()); i++) {
    let loadInfo = {
      inCanister: i,
    };
    chunksAsPromises.push(videoBackend.loadVideo(video_id_unpacked, loadInfo));
  }
  const nestedBytes = (await Promise.all(chunksAsPromises))
    .map((val) => {
      if (val[0] === undefined) {
        return null;
      } else {
        return val[0].inCanister.data;
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
  const vidURL = URL.createObjectURL(videoBlob);
  return vidURL;
}

function _processAndUploadChunk(
  videoBuffer,
  byteStart,
  videoSize,
  videoId,
  chunkNum
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

async function uploadVideo(videoName, videoDescription, video) {

  await agent.fetchRootKey();
  console.debug('starting upload');
  if (!video.size) {
    throw new Error('The video you are trying to upload has no size', video);
  }
  const chunkCount = Number(Math.ceil(video.size / maxChunkSize));
  console.debug('chunkCount:', chunkCount, `timestamp: ${Date.now()}`);

  const id = await videoBackend.createVideo({
    name: videoName,
    video_id: [],
    owner: Principal.fromUint8Array([]),
    description: videoDescription,
    keywords: [],
    storage_type: { inCanister : chunkCount}, 
  });
  console.debug('videoId:', id, `timestamp: ${Date.now()}`);

  const videoBuffer = (await video?.arrayBuffer()) || new ArrayBuffer(0);
  const putChunkPromises = [];

  let chunk = 0;
  for (
    let byteStart = 0;
    byteStart < video.size;
    byteStart += maxChunkSize, chunk++
  ) {
    putChunkPromises.push(
      _processAndUploadChunk(videoBuffer, byteStart, video.size, id, chunk)
    );
  }
  console.debug('starting to upload chunks', `timestamp: ${Date.now()}`);
  await Promise.all(putChunkPromises);
  console.debug('upload finished', `timestamp: ${Date.now()}`);
}

export { loadDefaultFeed, loadVideo, uploadVideo };
