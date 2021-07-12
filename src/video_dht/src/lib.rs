use ic_cdk::export::candid::{CandidType, Deserialize, Principal, Encode, Decode};
use ic_cdk_macros::*;
use ic_cdk::api::call;


#[derive(CandidType, Deserialize)]
struct CreateCanisterResult {
    canister_id: Principal,
}

#[update(name = "createCanister")]
pub async fn create_canister() -> Principal{
    let manage_princ = Principal::from_text("aaaaa-aa").unwrap();
    let response: Result<(CreateCanisterResult,), _> = call::call( manage_princ, "create_canister", ()).await;

    return response.unwrap().0.canister_id;
}
