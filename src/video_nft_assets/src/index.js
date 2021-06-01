import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as video_nft_idl, canisterId as video_nft_id } from 'dfx-generated/video_nft';

const agent = new HttpAgent();
const video_nft = Actor.createActor(video_nft_idl, { agent, canisterId: video_nft_id });

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  const greeting = await video_nft.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
