use ic_cdk::export::candid::{CandidType, Deserialize};

use super::VideoId;

pub mod local;

pub type ChunkData = Vec<u8>;
pub type ChunkNum = usize;

#[derive(Clone, CandidType, Deserialize)]
pub struct IPFSData;

#[derive(Clone, CandidType, Deserialize)]
pub struct Chunk{
    data: ChunkData,
    num: ChunkNum,
}

#[derive(Clone, CandidType, Deserialize)]
pub enum StorageType{
    #[serde(rename = "inCanister")]
    InCanister(ChunkNum),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap(ChunkNum),
    #[serde(rename = "ipfs")]
    IPFS(IPFSData),
}

#[derive(Clone, CandidType, Deserialize)]
pub enum VideoData{
    #[serde(rename = "inCanister")]
    InCanister(Chunk),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap(Chunk),
    #[serde(rename = "ipfs")]
    IPFS(IPFSData)
}

#[derive(Clone, CandidType, Deserialize)]
pub enum LoadInfo{
    #[serde(rename = "inCanister")]
    InCanister(ChunkNum),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap(ChunkNum),
    #[serde(rename = "ipfs")]
    IPFS,
}

pub fn store_video(video_id: VideoId, storage_data: VideoData){
    match storage_data {
        VideoData::InCanister(chunk) => local::store_chunk(video_id, chunk),
        _ => unimplemented!(),
    }
}

pub fn load_video(video_id: VideoId, load_info: LoadInfo) -> Option<VideoData>{
    match load_info {
        LoadInfo::InCanister(chunk_num) => { 
            match local::load_chunk(video_id, chunk_num){
                Some(chunk) => Some(VideoData::InCanister(chunk)),
                None => None,
            }
        }
        _ => unimplemented!(),
    }
}

pub fn create_video(video_id: VideoId, storage_type: &StorageType){
    match storage_type {
        StorageType::InCanister(chunk_num) => local::create_video_store(video_id, chunk_num),
        _ => unimplemented!(),
    }
}
