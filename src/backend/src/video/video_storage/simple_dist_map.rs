use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::call;

use super::super::VideoId;
use super::ChunkNum;

#[derive(CandidType, Deserialize)]
struct PrincipalResult{
    principal: Principal,
}

static DHT_PRINCIPAL: &str = env!("CANISTER_ID_video_dht");

pub async fn create_video(video_id: &VideoId, size: ChunkNum) -> Principal{

    let dht_princ = Principal::from_text(DHT_PRINCIPAL.clone()).expect("Couldnt deduce Principal from dht canister id text");

    let response: Result<(Principal,), _> = call::call( dht_princ, "createVideo", (video_id, size,)).await;

    match response{
        Ok((bucket_res,)) => return bucket_res,
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error creating video in dht with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}
