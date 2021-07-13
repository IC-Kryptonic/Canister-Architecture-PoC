use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_cdk::storage;
use ic_cdk::api::call;

use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

pub type VideoId = String;
pub type ChunkNum = usize;
pub type BucketStore = Vec<Option<Principal>>;
pub type BucketCode = Vec<u8>;

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

#[derive(CandidType)]
struct InstallCodeArg {
    mode: InstallMode,
    canister_id: Principal,
    wasm_module: Vec<u8>,
    arg : Vec<u8>,
}


#[init]
fn init(mut bucket_code: Vec<u8>){
    storage::get_mut::<BucketStore>().append(&mut vec![None; MAP_SIZE]);

    storage::get_mut::<BucketCode>().append(&mut bucket_code);
}

#[post_upgrade]
pub fn post_upgrade() {
    init(Vec::new()); //TODO SAVE WASM CODE AND RESTORE IT
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
    let manage_princ = Principal::management_canister();


}

async fn create_canister() -> Principal{
    let manage_princ = Principal::from_text("aaaaa-aa").unwrap();
    let response: Result<(CreateCanisterResult,), _> = call::call( manage_princ, "create_canister", ()).await;

    return response.unwrap().0.canister_id;
}
