use ic_cdk_macros::*;

use super::super::VideoId;
use super::ChunkNum;


#[import(canister = "video_dht")]
struct DHTCanister;

pub async fn create_video(video_id: VideoId, size: ChunkNum){
    DHTCanister::createVideo(video_id, size as u64).await;
}
