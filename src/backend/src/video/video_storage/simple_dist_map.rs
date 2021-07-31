use ic_cdk::export::candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::call;

use super::super::VideoId;
use super::ChunkNum;

#[derive(CandidType, Deserialize)]
struct PrincipalResult{
    principal: Principal,
}

/*#[import(canister = "video_dht")]
struct DHTCanister;*/

static DHT_PRINCIPAL: &str = env!("CANISTER_ID_video_dht");//std::env::var("CANISTER_ID_video_dht").expect("Couldn't load dht canister id");

pub async fn create_video(video_id: &VideoId, size: ChunkNum) -> Principal{
    /*let raw_result = DHTCanister::createVideo(video_id.clone(), size as u64).await.0;
    let result = Decode!(&raw_result, PrincipalResult);

    match result{
        Ok(principal_result) => {
            return principal_result.principal;
        }
        Err(err) => {
            ic_cdk::api::trap(format!("Error creating video in dht with message: {}", err).as_str());
        }
    };*/
    /*let princ_raw = DHTCanister::call(video_id.clone(), size as u64).await.0;

    ic_cdk::api::print("Created video in dht");
    Principal::from_slice(&princ_raw)
    DHTCanister::canister_id
    */

    let dht_princ = Principal::from_text(DHT_PRINCIPAL.clone()).expect("Couldnt deduce Principal from dht canister id text");

    let response: Result<(Principal,), _> = call::call( dht_princ, "createVideo", (video_id, size,)).await;

    match response{
        Ok((bucket_res,)) => return bucket_res,
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error creating video in dht with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}
