import { Actor, HttpAgent, Principal } from '@dfinity/agent';
import {
  idlFactory as video_idl,
  canisterId as backendVideoId,
} from 'dfx-generated/rust_video';

const agent = new HttpAgent();
const videoBackend = Actor.createActor(video_idl, {
  agent,
  canisterId: backendVideoId,
});

async function loadDefaultFeed(count) {
  const feed = await videoBackend.getDefaultFeed(count);
  return feed;
}

async function loadVideo(videoInfo) {
  const { video_id, chunk_count } = videoInfo;
  const chunkBuffers = [];
  const chunksAsPromises = [];
  for (let i = 0; i <= Number(chunk_count.toString()); i++) {
    chunksAsPromises.push(videoBackend.getChunk(i, video_id));
  }
  const nestedBytes = (await Promise.all(chunksAsPromises))
    .map((val) => {
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

export { loadDefaultFeed, loadVideo };
