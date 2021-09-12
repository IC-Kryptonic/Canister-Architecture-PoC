use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_cdk::storage;
use ic_cdk::api::call;

static AD_CODE: &[u8;  include_bytes!("../../../target/wasm32-unknown-unknown/release/ad_canister_opt.wasm").len()] = include_bytes!("../../../target/wasm32-unknown-unknown/release/ad_canister_opt.wasm");

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
    canister: Option<Principal>,
    name: String,
    chunk_num: ChunkNum,
}

#[update(name = "createAd")]
pub async fn create_ad(mut ad_info: AdInfo) -> AdInfo{
    let canister = create_canister().await;

    ad_info.canister = Some(canister.clone());

    install_ad(canister.clone(), &ad_info).await;

    let ads = storage::get_mut::<AdStore>();
    ads.push(canister);

    return ad_info;
}

#[query(name = "getRandomAdPrincipal")]
pub async fn get_random_ad_principal() -> Option<Principal>{
    let ads = storage::get::<AdStore>();

    return if ads.is_empty(){
        None
    } else {
        let i = ic_cdk::api::time() as usize % ads.len();   //rand crate not supported even with js enabled for wasm, so we use time to generate random values
        Some(ads[i])
    }
}

async fn create_canister() -> Principal {
    let manage_princ = Principal::management_canister();
    let response: Result<(CreateCanisterResult, ), _> = call::call(manage_princ, "create_canister", ()).await;

    match response {
        Ok(res) => return res.0.canister_id,
        Err(err) => {
            ic_cdk::api::trap(format!("Could not create new canister: {}", err.1).as_str());
        }
    }
}

async fn install_ad(canister: Principal, ad_info: &AdInfo){
    let manage_princ = Principal::management_canister();

    let install_arg = InstallCodeArg {
        mode: InstallMode::Install,
        canister_id: canister.clone(),
        wasm_module: AD_CODE.to_vec(),
        arg: vec![],
    };

    let response: Result<(), _> = call::call( manage_princ, "install_code", (install_arg,)).await;

    match response {
        Ok(_) => (),
        Err(err) => {
            ic_cdk::api::trap(format!("Could not install add code into canister: {}", err.1).as_str());
        }
    }

    let response: Result<(), _> = call::call( canister, "createAd", (ad_info,)).await;

    match response {
        Ok(_) => (),
        Err(err) => {
            ic_cdk::api::trap(format!("Could not create add in ad canister: {}", err.1).as_str());
        }
    }
}