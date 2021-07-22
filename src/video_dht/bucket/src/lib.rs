use ic_cdk_macros::*;
use ic_cdk::storage;

use std::collections::HashMap;

pub type VideoId = String;
pub type ChunkNum = usize;
pub type Chunk = Vec<u8>;
pub type Chunks = Vec<Chunk>;
pub type VideoStore = HashMap<VideoId, Chunks>;

///Creates a new video in the bucket
#[update(name = "createVideo")]
pub async fn create_video(id: VideoId, chunk_num: ChunkNum){
    let video_storage = storage::get_mut::<VideoStore>();

    video_storage.insert(id, vec![Vec::new(); chunk_num]);
    ic_cdk::print("Created a new video");
}

///Inserts new chunk into existing video
#[update(name = "insertChunk")]
pub async fn insert_chunk(id: VideoId, chunk_num: ChunkNum, chunk: Chunk){
    let video_storage = storage::get_mut::<VideoStore>();

    match video_storage.get_mut(&id){
        Some(chunks) => chunks[chunk_num] = chunk,
        None => {
            ic_cdk::api::trap("that chunk number does not exist for the video");
        }
    }
}


///Retrieve a chunk
#[query(name = "getChunk")]
pub async fn get_chunk(id: VideoId, chunk_num: ChunkNum) -> Option<&'static Chunk>{
    let video_storage = storage::get::<VideoStore>();

    match video_storage.get(&id){
        Some(chunks) => {
            chunks.get(chunk_num).and_then( |chunk| {
                if chunk.len() == 0 {
                    None
                } else {
                    Some(chunk)
                }
            })
        }
        None => None,
    }
}
