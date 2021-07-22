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
}
