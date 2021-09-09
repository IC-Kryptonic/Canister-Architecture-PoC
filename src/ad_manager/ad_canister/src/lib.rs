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
pub async fn create_ad(ad_info: &mut AdInfo){
    let mut chunk_store = storage::get_mut::<Chunks>();
    let mut empty_chunks: Chunks = vec![Vec::new(); ad_info.chunk_num];
    chunk_store.append(&mut empty_chunks);

    let ad_info_store = storage::get_mut::<AdInfo>();
    std::mem::swap(ad_info_store, ad_info);
}

///Inserts a new chunk
#[update(name = "insertChunk")]
pub async fn insert_chunk(chunk_num: ChunkNum, chunk: Chunk){
    let mut chunks = storage::get_mut::<Chunks>();

    chunks[chunk_num] = chunk;
}


///Retrieve a chunk
#[query(name = "getChunk")]
pub async fn get_chunk(chunk_num: ChunkNum) -> Option<&'static Chunk>{
    storage::get::<Chunk>().get(chunk_num)
}