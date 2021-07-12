use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_cdk::api::call;

pub type VideoId = String;
pub type ChunkNum = usize;

#[derive(CandidType, Deserialize)]
struct CreateCanisterResult {
    canister_id: Principal,
}

#[update(name = "createVideo")]
pub async fn create_video(id: VideoId, chunk_num: ChunkNum){
    ic_cdk::api::print(format!("Creating Video {} with {} chunks", id, chunk_num));
}

#[update(name = "createCanister")]
pub async fn create_canister() -> Principal{
    let manage_princ = Principal::from_text("aaaaa-aa").unwrap();
    let response: Result<(CreateCanisterResult,), _> = call::call( manage_princ, "create_canister", ()).await;

    return response.unwrap().0.canister_id;
}
