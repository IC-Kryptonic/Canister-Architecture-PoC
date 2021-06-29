use ic_cdk::storage;

use std::collections::HashMap;

use super::super::VideoId;
use super::ChunkData;
use super::Chunk;
use super::ChunkNum;

pub type Chunks = Vec<ChunkData>;
pub type ChunkStore = HashMap<VideoId, Chunks>;

pub fn store_chunk(video_id: VideoId, chunk: Chunk){
    let chunk_store = storage::get_mut::<ChunkStore>();
    
    if let Some(video_chunks) = chunk_store.get_mut(&video_id){
        video_chunks[chunk.num] = chunk.data;
    } else {
        ic_cdk::api::print("Video does not exist in Chunk Store");
    }
}

pub fn load_chunk(video_id: VideoId, chunk_num: ChunkNum) -> Option<Chunk> {
    let chunk_store = storage::get::<ChunkStore>();
    
    if let Some(video_chunks) = chunk_store.get_mut(&video_id){
        Some(Chunk {
            data: video_chunks.get(chunk_num),
            num: chunk_num,
        })
    } else {
        ic_cdk::api::print("Video does not exist in Chunk Store");
        None
    }
}

pub fn create_video_store(video_id: VideoId, size: ChunkNum){
    let chunk_store = storage::get_mut::<ChunkStore>();

    chunk_store.insert(video_id, vec![Vec::new(), size]);
}
