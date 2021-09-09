use ic_cdk_macros::*;
use ic_cdk::storage;
use ic_cdk::export::candid::{CandidType, Deserialize, Principal};

pub type VideoId = String;
pub type ChunkNum = usize;
pub type Chunk = Vec<u8>;
pub type Chunks = Vec<Chunk>;

#[derive(CandidType, Deserialize)]
pub struct AdInfo{
    owner: Principal,
    name: String,
    chunk_num: ChunkNum,
}


///Creates a new ad video in the bucket
#[update(name = "createAd")]
pub async fn create_ad(){
    unimplemented!()
}

///Inserts a new chunk
#[update(name = "insertChunk")]
pub async fn insert_chunk(chunk_num: ChunkNum, chunk: Chunk){
    unimplemented!()
}


///Retrieve a chunk
#[query(name = "getChunk")]
pub async fn get_chunk(id: VideoId, chunk_num: ChunkNum) -> Option<&'static Chunk>{
   unimplemented!()
}