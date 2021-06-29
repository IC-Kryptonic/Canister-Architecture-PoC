use ic_cdk::export::candid::{CandidType, Deserialize};

use super::VideoId;

mod local;

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
    InCanister(ChunkNum),
    SimpleDistMap(ChunkNum),
    IPFS(IPFSData),
}

#[derive(Clone, CandidType, Deserialize)]
pub enum VideoData{
    InCanister(Chunk),
    SimpleDistMap(Chunk),
    IPFS(IPFSData)
}

#[derive(Clone, CandidType, Deserialize)]
pub enum LoadInfo{
    InCanister(ChunkNum),
    SimpleDistMap(ChunkNum),
    IPFS,
}

pub fn storeVideo(video_id: VideoId, storage_data: VideoData){
    match storage_data {
        VideoData::InCanister(chunk) => local::store_chunk(video_id, chunk),
        _ => unimplemented!(),
    }
}

pub fn loadVideo(video_id: VideoId, load_info: LoadInfo) -> Option<VideoData>{
    match load_info {
        VideoData::InCanister(chunk_num) => local::load_chunk(video_id, chunk_num),
        _ => unimplemented!(),
    }
}

pub fn createVideo(video_id: VideoId, storage_type: StorageType){
    match storage_type {
        VideoData::InCanister(chunk_num) => local::create_video_store(video_id, chunk_num),
        _ => unimplemented!(),
    }
}
