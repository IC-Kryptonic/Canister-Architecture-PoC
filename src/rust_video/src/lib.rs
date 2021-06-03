use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::storage;
use ic_cdk_macros::*;
use std::collections::HashMap;

type VideoInfoStore = HashMap<VideoId, VideoInfo>;
type VideoId = String;
type VideoChunk = Vec<u8>;
type VideoChunks = Vec<VideoChunk>;
type ChunkStore = HashMap<VideoId, VideoChunks>;
type Feed = Vec<VideoInfo>;

#[derive(Clone, Debug, Default, CandidType, Deserialize)]
struct VideoInfo{
    pub video_id: VideoId,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
    pub chunk_count: usize,
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
fn create_video(mut video: VideoInfo) -> VideoId{
    let info_store = storage::get_mut::<VideoInfoStore>();
    let chunk_store = storage::get_mut::<ChunkStore>();
    
    let id = loop{
        let generated = generate_video_id(&video);
        if !info_store.contains_key(&generated){
            break generated;
        }
    };
        

    video.video_id = id.clone();
    chunk_store.insert(id.clone(), vec![Vec::new(); video.chunk_count]);
    info_store.insert(id.clone(), video);
    return id;
}

#[update]
fn put_chunk(chunk: Vec<u8>, chunk_num: usize, video_id: VideoId){
    let chunk_store = storage::get_mut::<ChunkStore>();

    let video_chunks = chunk_store.get_mut(&video_id).unwrap();

    video_chunks.insert(chunk_num, chunk);
}

#[query]
fn get_chunk(chunk_num: usize, video_id: VideoId) -> VideoChunk{
    let chunk_store = storage::get::<ChunkStore>();

    let video_chunks = chunk_store.get(&video_id).unwrap();

    video_chunks
        .get(chunk_num)
        .cloned()
        .unwrap_or_else(|| VideoChunk::default())
}

#[query]
fn get_default_feed(num: usize) -> Feed{
    let video_store = storage::get::<VideoInfoStore>();

    video_store
        .values()
        .cloned()
        .take(num)
        .collect()
}


fn generate_video_id(info: &VideoInfo) -> VideoId{
    let time = ic_cdk::api::time();
    let name = info.name.clone();

    return format!("{}{}", name, time);
}
