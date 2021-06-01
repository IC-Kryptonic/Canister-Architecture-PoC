use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::storage;
use ic_cdk_macros::*;
use std::collections::HashMap;

type VideoStore = HashMap<VideoId, VideoInfo>;
type VideoId = String;
type VideoChunks = [u8];
type ChunkStore = HashMap<VideoId, VideoChunks>; 

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
struct VideoInfo{
    pub video_id: VideoId,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
}

#[query]
fn get_video_info(id: VideoId) -> VideoInfo {
    let video_store = storage::get::<VideoStore>();

    video_store
        .get(&id)
        .cloned()
        .unwrap_or_else(|| VideoInfo::default())
}

#[update]
fn update_video_info(video: VideoInfo) {
    let video_store = storage::get_mut::<VideoStore>();

    video_store.insert(video.video_id.clone(), video);
}
