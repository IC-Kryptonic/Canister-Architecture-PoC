import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import {
  idlFactory as video_idl,
  canisterId as backendVideoId,
} from 'dfx-generated/backend';
import { Post } from '../interfaces/video_interface';

const agent = new HttpAgent();
const videoBackend = Actor.createActor(video_idl, {
  agent,
  canisterId: backendVideoId,
});
const maxChunkSize = 1024 * 500; // 500kb

async function loadDefaultFeed(count: number): Promise<Array<Post>> {
  const feed = (await videoBackend.getDefaultFeed(count)) as Array<Post>;
  return feed;
}

async function loadVideo(videoInfo: Post): Promise<string> {
  const { video_id, chunk_count } = videoInfo;
  const chunkBuffers: Uint8Array[] | Buffer[] = [];
  const chunksAsPromises = [];
  for (let i = 0; i <= Number(chunk_count.toString()); i++) {
    chunksAsPromises.push(videoBackend.getChunk(i, video_id));
  }
  const nestedBytes = (await Promise.all(chunksAsPromises))
    .map((val: Array<number>) => {
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
  const vidURL = URL.createObjectURL(videoBlob);
  return vidURL;
}

function _processAndUploadChunk(
  videoBuffer: ArrayBuffer,
  byteStart: number,
  videoSize: number,
  videoId: string,
  chunk: number
) {
  const videoSlice = videoBuffer.slice(
    byteStart,
    Math.min(videoSize, byteStart + maxChunkSize)
  );
  const data = Array.from(new Uint8Array(videoSlice));
  return videoBackend.putChunk(data, chunk, videoId);
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
  const chunkCount = Number(Math.ceil(video.size / maxChunkSize));
  console.debug('chunkCount:', chunkCount, `timestamp: ${Date.now()}`);

  const id = (await videoBackend.createVideo({
    name: videoName,
    owner: Principal.fromUint8Array(new Uint8Array([])),
    description: videoDescription,
    video_id: '', // TODO id should be set by backend, why set it here?
    chunk_count: chunkCount,
    keywords: [],
  })) as string;
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
