use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_cdk::storage;
use ic_cdk::api::call;

use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

pub type VideoId = String;
pub type ChunkNum = usize;
pub type BucketStore = Vec<Option<Principal>>;

const MAP_SIZE: usize = 10000;

#[derive(CandidType, Deserialize)]
struct CreateCanisterResult {
    canister_id: Principal,
}

#[init]
pub fn init(){
    let mut store = storage::get_mut::<BucketStore>();
    store.append(&mut vec![None; MAP_SIZE])
}

///Creates a new video canister, currently it always creates a new bucket which only stores this
///one video
#[update(name = "createVideo")]
pub async fn create_video(id: VideoId, chunk_num: ChunkNum){
    let canister_princ = create_canister().await;
    install_bucket(&canister_princ).await;
    create_video_bucket(&canister_princ, &id, chunk_num).await;

    let mut hasher = DefaultHasher::new();
    id.hash(&mut hasher);
    let hash = hasher.finish() as usize % MAP_SIZE;

    let buckets = storage::get_mut::<BucketStore>();

    match &buckets[hash]{
        Some(_bucket) => {
            unimplemented!(); //collision
        }
        None => {
            buckets[hash] = Some(canister_princ);
        }
    }

    ic_cdk::api::print(format!("Created Video {} with {} chunks", id, chunk_num));
}

async fn create_video_bucket(_princ: &Principal, _id: &VideoId, _chunk_num: ChunkNum){
    ic_cdk::api::print("Create video net yet implemented");
}

async fn install_bucket(_princ: &Principal){
    ic_cdk::api::print("Instal Bucket not yet implemented");
}

async fn create_canister() -> Principal{
    let manage_princ = Principal::from_text("aaaaa-aa").unwrap();
    let response: Result<(CreateCanisterResult,), _> = call::call( manage_princ, "create_canister", ()).await;

    return response.unwrap().0.canister_id;
}
