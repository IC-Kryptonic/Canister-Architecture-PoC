use std::io::Read;
use ic_agent::export::Principal;
use ic_cdk::export::candid::{Encode, Decode};
use crate::util::Actor;
use std::fs::{File, DirEntry};
use serde_json;

mod util;

use video_types::{VideoInfo, StorageType, MAX_CHUNK_SIZE, Profile, Chunks, TokenMetadata};
use ic_agent::Identity;

#[tokio::main]
async fn main() {
    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let ad_manager = Actor::from_name("ad_manager", identity).await;

    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let video_backend = Actor::from_name("video_backend", identity).await;

    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let profile_backend = Actor::from_name("profile_backend", identity).await;

    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let token_manager = Actor::from_name("token_management", identity).await;


    println!("Seeding Ads ...");
    create_ads(&ad_manager, &video_backend).await;

    println!("Seeding Videos ...");
    create_videos(&video_backend, &token_manager).await;

    println!("Seeding my Profile ...");
    create_profile(&profile_backend).await;
}

async fn create_ads(ad_manager: &Actor, video_backend: &Actor){
    let dir = std::fs::read_dir("seed_data/ads/").expect("Could not open seeding ads folder");

    for file in dir{
        let file = file.expect("Could not get file from directory");
        create_ad(file, ad_manager, video_backend).await;
    }
}

async fn create_ad(file: DirEntry, ad_manager: &Actor, video_backend: &Actor){
    let name = file.file_name();
    let video = std::fs::File::open(file.path()).expect("Could not open ad video file");

    let chunks = chunkify_video(video);

    let ad_info = VideoInfo{
        owner: Principal::anonymous(),
        name: String::from(name.to_str().expect("Could not convert OSString to Rust str").strip_suffix(".mp4").expect("Could not strip mp4 from name")),
        description: "".to_string(),
        keywords: vec![],
        thumbnail: vec![],
        storage_type: StorageType::Canister(chunks.len(), None),
        views: 0,
        creator: Principal::anonymous(),
        likes: 0
    };

    let ad_canister = upload_video(ad_info, chunks, false, video_backend).await;

    let ad_arg = Encode!(&ad_canister).expect("Could not encode ad principal");
    let response = ad_manager.update_call("add_ad", ad_arg).await;
    let raw_result = util::check_ok(response);
    Decode!(raw_result.as_slice(), ()).expect("Could not decode empty add_ad result");
}

async fn upload_video(info: VideoInfo, chunks: Chunks, save: bool, video_backend: &Actor) -> Principal{
    let arg = Encode!(&info, &save).expect("Could not encode video info");

    let response = video_backend.update_call("create_video", arg).await;
    let raw_result = util::check_ok(response);
    let result_info = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode result video info");

    let video_canister = if let StorageType::Canister(_chunks, may_canister) = result_info.storage_type{
        may_canister.expect("Result video info did not have bucket principal")
    } else{
        panic!("Send Storage type differs from returned storage type")
    };

    println!("Video {}: {}", info.name, video_canister.clone());

    let video_actor = util::Actor{
        agent: video_backend.agent.clone(),
        principal: video_canister.clone(),
    };

    for (i, chunk) in chunks.iter().enumerate(){
        let chunk_data = Encode!(&i, &chunk).expect("Could not encode chunk");
        let response = video_actor.update_call("insert_chunk", chunk_data).await;
        util::check_ok(response);
    }

    return video_canister;
}


async fn create_videos(video_backend: &Actor, token_manager: &Actor){
    let dir = std::fs::read_dir("seed_data/videos/").expect("Could not open seeding videos folder");

    for file in dir{
        let file = file.expect("Could not get file from directory");
        create_video(file, video_backend, token_manager).await;
    }
}

async fn create_video(file: DirEntry, video_backend: &Actor, token_manager: &Actor){

    let name = file.file_name();
    let video = std::fs::File::open(file.path()).expect("Could not open video file");

    let chunks = chunkify_video(video);

    let video_info = VideoInfo{
        owner: Principal::anonymous(),
        name: String::from(name.to_str().expect("Could not convert OSString to Rust str").strip_suffix(".mp4").expect("Could not strip mp4 from name")),
        description: String::new(),
        keywords: vec![],
        creator: Principal::anonymous(),
        storage_type: StorageType::Canister(chunks.len(), None),
        views: 0,
        thumbnail: vec![],
        likes: 0
    };

    println!("Uploading video for {}", video_info.name.clone());
    let video_canister = upload_video(video_info.clone(), chunks, true, video_backend).await;
    println!("Creating token for {}", video_info.name.clone());

    create_token(video_info, video_canister, token_manager).await;
}

async fn create_token(info: VideoInfo, video_canister: Principal, token_manger: &Actor){

    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES).sender().expect("Could not get sender for identity");

    let metadata = TokenMetadata{
        storage_canister_id: video_canister.to_text(),
        description: info.description.clone(),
        creator: identity.to_text(),
    };

    let metadata_string = serde_json::to_string(&metadata).expect("Could not stringify metadata");

    let arg = Encode!(&identity.to_text(), &info.name, &String::new(), &2u8, &20u128, &metadata_string).expect("Could not encode create token args");

    let response = token_manger.update_call("createToken", arg).await;
    let raw_result = util::check_ok(response);
    Decode!(raw_result.as_slice(), ()).expect("Could not decode empty result from createToken call");
}

async fn create_profile(profile_backend: &Actor){

    let profile = Profile{
        principal: Principal::anonymous(),
        name: "Seeder".to_string(),
        likes: Default::default(),
        comments: Default::default(),
        viewed: Default::default()
    };

    let arg = Encode!(&profile).expect("Could not encode profile");

    let response = profile_backend.update_call("put_profile", arg).await;
    let raw_result = util::check_ok(response);
    Decode!(raw_result.as_slice(), ()).expect("Could not decode result for put profile");
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
