use std::io::Read;
use ic_agent::export::Principal;
use ic_cdk::export::candid::{Encode, Decode, CandidType, Deserialize};
use crate::util::Actor;
use std::fs::File;

mod util;

type ChunkNum = usize;
type VideoId = String;
#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct IPFSData {
    data: String,
}

const MAX_CHUNK_SIZE: usize = 1024 * 500; // 500kb

#[derive(CandidType, Deserialize)]
pub struct AdInfo{
    owner: Principal,
    canister: Option<Principal>,
    name: String,
    chunk_num: ChunkNum,
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub enum StorageType {
    #[serde(rename = "inCanister")]
    InCanister(ChunkNum),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap(ChunkNum, Option<Principal>),
    #[serde(rename = "ipfs")]
    IPFS(IPFSData),
}

#[derive(CandidType, Deserialize)]
pub struct VideoInfo {
    pub video_id: Option<VideoId>,
    pub owner: Principal,
    pub creator: Principal,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
    pub storage_type: StorageType,
}

#[tokio::main]
async fn main() {
    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let ad_manager = Actor::from_name("ad_manager", identity).await;
    upload_ads(&ad_manager).await;

    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let video_backend = Actor::from_name("backend", identity).await;
    upload_videos(&video_backend).await;
}

async fn upload_ads(ad_manager: &Actor){
    let dir = std::fs::read_dir("seed_data/ads/").expect("Could not open seeding ads folder");

    for file in dir{
        let file = file.expect("Could not get file from directory");
        let name = file.file_name();
        let video = std::fs::File::open(file.path()).expect("Could not open ad video file");

        let chunks = chunkify_video(video);

        let ad_info = AdInfo{
            owner: Principal::anonymous(),
            canister: None,
            name: String::from(name.to_str().expect("Could not convert OSString to Rust str").strip_suffix(".mp4").expect("Could not strip mp4 from name")),
            chunk_num: chunks.len(),
        };

        let arg = Encode!(&ad_info).expect("Could not encode ad info");

        let response = ad_manager.update_call("createAd", arg).await;
        let raw_result = util::check_ok(response);
        let result_info = Decode!(raw_result.as_slice(), AdInfo).expect("Could not decode result ad info");

        let ad_canister = result_info.canister.expect("No canister principal in result info");
        let ad_actor = util::Actor{
            agent: ad_manager.agent.clone(),
            principal: ad_canister,
        };

        for (i, chunk) in chunks.iter().enumerate(){
            let chunk_data = Encode!(&i, &chunk).expect("Could not encode chunk");
            let response = ad_actor.update_call("insertChunk", chunk_data).await;
            util::check_ok(response);
        }
    }
}

async fn upload_videos(video_backend: &Actor){
    let dir = std::fs::read_dir("seed_data/videos/").expect("Could not open seeding videos folder");

    for file in dir{
        let file = file.expect("Could not get file from directory");
        let name = file.file_name();
        let video = std::fs::File::open(file.path()).expect("Could not open video file");

        let chunks = chunkify_video(video);

        let video_info = VideoInfo{
            video_id: None,
            owner: Principal::anonymous(),
            name: String::from(name.to_str().expect("Could not convert OSString to Rust str").strip_suffix(".mp4").expect("Could not strip mp4 from name")),
            description: String::new(),
            keywords: vec![],
            creator: Principal::anonymous(),
            storage_type: StorageType::SimpleDistMap(chunks.len(), None),
        };

        let arg = Encode!(&video_info).expect("Could not encode video info");

        let response = video_backend.update_call("createVideo", arg).await;
        let raw_result = util::check_ok(response);
        let result_info = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode result video info");

        let video_id = result_info.video_id.expect("Video id not in result");
        let video_canister = if let StorageType::SimpleDistMap(_chunks, may_bucket) = result_info.storage_type{
            may_bucket.expect("Result video info did not have bucket principal")
        } else{
            panic!("Send Storage type differs from returned storage type")
        };

        let video_actor = util::Actor{
            agent: video_backend.agent.clone(),
            principal: video_canister,
        };

        for (i, chunk) in chunks.iter().enumerate(){
            let chunk_data = Encode!(&video_id, &i, &chunk).expect("Could not encode chunk");
            let response = video_actor.update_call("insertChunk", chunk_data).await;
            util::check_ok(response);
        }
    }
}

fn chunkify_video(video: File) ->Vec<Vec<u8>>{
    let mut chunks = Vec::new();

    for (i, byte) in video.bytes().enumerate(){
        if i % MAX_CHUNK_SIZE == 0{
            chunks.push(vec![byte.expect("Could not get first chunk byte")]);
        }
        else {
            chunks[i / MAX_CHUNK_SIZE].push(byte.expect("Could not get byte"));
        }
    }

    return chunks;
}
