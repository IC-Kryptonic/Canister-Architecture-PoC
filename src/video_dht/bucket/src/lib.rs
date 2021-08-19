use ic_cdk_macros::*;
use ic_cdk::storage;

use sha2::{Sha256, Digest};

use std::collections::HashMap;
use std::convert::TryInto;

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

///Retrieve sha256 hash of a video
#[query(name = "getHash")]
pub async fn get_hash(id: VideoId) -> Option<[u8; 256/8]>{
    let mut hasher = Sha256::new();

    if !is_fully_uploaded(&id){
        return None;
    }

    let video_storage = storage::get::<VideoStore>();

    match video_storage.get(&id){
        Some(chunks) => {
            for chunk in chunks{
                hasher.update(&chunk);
            }
        }
        None => return None,
    }

    return Some(hasher.finalize().as_slice().try_into().unwrap());
}

fn is_fully_uploaded(id: &VideoId) -> bool {
    let video_storage = storage::get::<VideoStore>();

    match video_storage.get(id){
        Some(chunks) => {
            for chunk in chunks{
                if chunk.is_empty(){
                    return false;
                }
            }
        }
        None => return false,
    }
    return true
}
