use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_cdk::storage;
use ic_cdk::api::call;

static BUCKET_CODE: &[u8;  include_bytes!("../../../target/wasm32-unknown-unknown/release/bucket_opt.wasm").len()] = include_bytes!("../../../target/wasm32-unknown-unknown/release/bucket_opt.wasm");

pub type ChunkNum = usize;
pub type AdStore = Vec<Principal>;

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

#[derive(CandidType, Deserialize)]
pub struct AdInfo{
    owner: Principal,
    name: String,
    chunk_num: ChunkNum,
}

#[update(name = "createAd")]
pub async fn create_ad(ad_info: AdInfo){
    unimplemented!("create ad not implemented");
}

#[query(name = "getRandomAdPrincipal")]
pub async fn get_random_ad_principal(){
    unimplemented!("random ad principal not implemented");
}