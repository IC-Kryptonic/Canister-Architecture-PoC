use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_cdk::storage;
use ic_cdk::api::call;

use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

pub type VideoId = String;
pub type ChunkNum = usize;
pub type BucketStore = Vec<Option<Principal>>;
pub type Chunk = Vec<u8>;

static BUCKET_CODE: &[u8;  include_bytes!("../../../target/wasm32-unknown-unknown/release/bucket_opt.wasm").len()] = include_bytes!("../../../target/wasm32-unknown-unknown/release/bucket_opt.wasm");
const MAP_SIZE: usize = 10000;

#[derive(CandidType, Deserialize)]
struct CreateCanisterResult {
    canister_id: Principal,
}

#[derive(CandidType, Deserialize)]
enum InstallMode {
    #[serde(rename = "install")]
    Install,
    #[serde(rename = "reinstall")]
    Reinstall,
    #[serde(rename = "upgrade")]
    Upgrade,
}

#[derive(CandidType, Deserialize)]
struct InstallCodeArg {
    mode: InstallMode,
    canister_id: Principal,
    wasm_module: Vec<u8>,
    arg : Vec<u8>,
}


#[init]
fn init(){
    storage::get_mut::<BucketStore>().append(&mut vec![None; MAP_SIZE]);
}

//TODO properly save and restore buckets
#[post_upgrade]
fn post_upgrade(){
    init();
}

///Creates a new video canister, currently it always creates a new bucket which only stores this
///one video
#[update(name = "createVideo")]
pub async fn create_video(id: VideoId, chunk_num: ChunkNum){
    let canister_princ = create_canister().await;
    install_bucket(&canister_princ).await;
    create_video_bucket(canister_princ.clone(), &id, chunk_num).await;

    let bucket_index = get_bucket_index(&id);

    let buckets = storage::get_mut::<BucketStore>();

    match &buckets[bucket_index]{
        Some(_bucket) => {
            unimplemented!(); //collision
        }
        None => {
            buckets[bucket_index] = Some(canister_princ.clone());
        }
    }

    ic_cdk::api::print(format!("Created Video {} with {} chunks in Bucket {}", id, chunk_num, canister_princ.to_string()));
}

#[update(name = "insertChunk")] //Can this be used as query to speed up, since nothing in this container changed?
pub async fn insert_chunk(id: VideoId, chunk_num: ChunkNum, chunk: Chunk){
    let bucket_index = get_bucket_index(&id);

    let buckets = storage::get::<BucketStore>();

    match &buckets[bucket_index]{
        Some(bucket) => {
            //TODO handle Response
            let response: Result<(), _> = call::call( bucket.clone(), "insertChunk", (id, chunk_num, chunk)).await;

            match response{
                Ok(_) => return,
                Err((rej_code, msg)) => {
                    ic_cdk::api::trap(format!("Error inserting video chunk in bucket with code {:?}, message: {}", rej_code, msg).as_str());
                }
            }
        }
        None => {
            ic_cdk::api::trap(format!("Can't insert chunk, bucket for video index {} does not exist", id).as_str());
        }
    }
}
            

async fn create_video_bucket(princ: Principal, id: &VideoId, chunk_num: ChunkNum){
    //TODO handle response
    let response: Result<(), _> = call::call( princ, "createVideo", (id, chunk_num,)).await;

    match response{
        Ok(_) => return,
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error creating video in bucket with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}

async fn install_bucket(new_princ: &Principal){
    let manage_princ = Principal::management_canister();

    let install_arg = InstallCodeArg {
        mode: InstallMode::Install,
        canister_id: new_princ.clone(),
        wasm_module: BUCKET_CODE.to_vec(),
        arg : Vec::new(),
    };

    //TODO hand response
    let _response: Result<(), _> = call::call( manage_princ, "install_code", (install_arg,)).await;
}

async fn create_canister() -> Principal{
    let manage_princ = Principal::management_canister();
    let response: Result<(CreateCanisterResult,), _> = call::call( manage_princ, "create_canister", ()).await;

    return response.unwrap().0.canister_id;
}

fn get_bucket_index(id: &VideoId) -> usize{
    let mut hasher = DefaultHasher::new();
    id.hash(&mut hasher);
    hasher.finish() as usize % MAP_SIZE
}
