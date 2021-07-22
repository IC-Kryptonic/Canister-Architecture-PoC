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

#[derive(CandidType, Deserialize)]
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
    create_video_bucket(canister_princ.clone(), &id, chunk_num).await;

    let mut hasher = DefaultHasher::new();
    id.hash(&mut hasher);
    let hash = hasher.finish() as usize % MAP_SIZE;

    let buckets = storage::get_mut::<BucketStore>();

    match &buckets[hash]{
        Some(_bucket) => {
            unimplemented!(); //collision
        }
        None => {
            buckets[hash] = Some(canister_princ.clone());
        }
    }

    ic_cdk::api::print(format!("Created Video {} with {} chunks in Bucket {:?}", id, chunk_num, canister_princ));
}

async fn create_video_bucket(princ: Principal, id: &VideoId, chunk_num: ChunkNum){
    //TODO handle response
    let _response: Result<(), _> = call::call( princ, "create_video", (id, chunk_num,)).await;

}

async fn install_bucket(new_princ: &Principal){
    let manage_princ = Principal::management_canister();

    let install_arg = InstallCodeArg {
        mode: InstallMode::Install,
        canister_id: new_princ.clone(),
        wasm_module: storage::get::<BucketCode>().clone(),
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
