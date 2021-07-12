use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use ic_cdk::api::call;

#[update(name = "testBucket")]
pub async fn call_bucket() {
    let principal = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai").unwrap();
    let _res: Result<(i32,), _>  = call::call( principal, "test", ()).await;
}
