use std::io::Read;
use ic_agent::export::Principal;
use ic_cdk::export::candid::{Encode, Decode, CandidType, Deserialize};

mod util;
type ChunkNum = usize;

const MAX_CHUNK_SIZE: usize = 1024 * 500; // 500kb

#[derive(CandidType, Deserialize)]
pub struct AdInfo{
    owner: Principal,
    canister: Option<Principal>,
    name: String,
    chunk_num: ChunkNum,
}

#[tokio::main]
async fn main() {
    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let ad_manager = util::Actor::from_name("ad_manager", identity).await;

    let ad1 = std::fs::File::open("seed_data/ads/straus.mp4").expect("Could not open straus mp4");

    let mut chunks = Vec::new();

    for (i, byte) in ad1.bytes().enumerate(){
        if i % MAX_CHUNK_SIZE == 0{
            chunks.push(vec![byte.expect("Could not get first chunk byte")]);
        }
        else {
            chunks[i / MAX_CHUNK_SIZE].push(byte.expect("Could not get byte"));
        }
    }

    let ad_info = AdInfo{
        owner: Principal::anonymous(),
        canister: None,
        name: String::from("Straus Ad"),
        chunk_num: chunks.len(),
    };

    let arg = Encode!(&ad_info).expect("Could not encode ad info");

    let response = ad_manager.update_call("createAd", arg).await;
    let raw_result = util::check_ok(response);
    let result_info = Decode!(raw_result.as_slice(), AdInfo).expect("Could not decode result ad info");

    let ad_canister = result_info.canister.expect("No canister principal in result info");
    let ad_actor = util::Actor{
        agent: ad_manager.agent,
        principal: ad_canister,
    };

    for (i, chunk) in chunks.iter().enumerate(){
        let chunk_data = Encode!(&i, &chunk).expect("Could not encode chunk");
        let response = ad_actor.update_call("insertChunk", chunk_data).await;
        util::check_ok(response);
    }
}
