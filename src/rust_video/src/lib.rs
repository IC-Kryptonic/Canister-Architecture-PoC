use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::storage;
use ic_cdk_macros::*;
use std::collections::HashMap;

type VideoInfoStore = HashMap<VideoId, VideoInfo>;
type VideoId = String;
type VideoChunk = u8;
type VideoChunks = Vec<u8>;
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
    let video_store = storage::get::<VideoInfoStore>();

    video_store
        .get(&id)
        .cloned()
        .unwrap_or_else(|| VideoInfo::default())
}

#[update]
fn update_video_info(video: VideoInfo) {
    let video_store = storage::get_mut::<VideoInfoStore>();

    video_store.insert(video.video_id.clone(), video);
}

#[update]
fn create_video(mut video: VideoInfo) {
    let id = generate_video_id(&video);
    video.video_id = id.clone();
    
    let info_store = storage::get_mut::<VideoInfoStore>();

    info_store.insert(id, video);
}

//TODO make unique
fn generate_video_id(info: &VideoInfo) -> VideoId{
    info.name.clone()
}
