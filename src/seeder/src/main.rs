use std::io::Read;
use ic_agent::export::Principal;
use ic_cdk::export::candid::{Encode, Decode};
use crate::util::Actor;
use std::fs::File;

mod util;

use video_types::{VideoInfo, StorageType, MAX_CHUNK_SIZE};

#[tokio::main]
async fn main() {
    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let ad_manager = Actor::from_name("ad_manager", identity).await;


    let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
    let video_backend = Actor::from_name("video_backend", identity).await;

    upload_ads(&ad_manager, &video_backend).await;
    upload_videos(&video_backend).await;
}

async fn upload_ads(ad_manager: &Actor, video_backend: &Actor){
    let dir = std::fs::read_dir("seed_data/ads/").expect("Could not open seeding ads folder");

    for file in dir{
        let file = file.expect("Could not get file from directory");
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

        let arg = Encode!(&ad_info, &false).expect("Could not encode ad info");

        let response = video_backend.update_call("create_video", arg).await;
        let raw_result = util::check_ok(response);
        let result_info = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode result ad info");

        let ad_canister = if let StorageType::Canister(_chunks, may_canister) = result_info.storage_type{
            may_canister.expect("Result video info did not have bucket principal")
        } else{
            panic!("Send Storage type differs from returned storage type")
        };

        let ad_actor = util::Actor{
            agent: ad_manager.agent.clone(),
            principal: ad_canister,
        };

        for (i, chunk) in chunks.iter().enumerate(){
            let chunk_data = Encode!(&i, &chunk).expect("Could not encode chunk");
            let response = ad_actor.update_call("insert_chunk", chunk_data).await;
            util::check_ok(response);
        }

        let ad_arg = Encode!(&ad_canister).expect("Could not encode ad principal");
        let response = ad_manager.update_call("add_ad", ad_arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty add_ad result");
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

        let arg = Encode!(&video_info, &true).expect("Could not encode video info");

        let response = video_backend.update_call("create_video", arg).await;
        let raw_result = util::check_ok(response);
        let result_info = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode result video info");

        let video_canister = if let StorageType::Canister(_chunks, may_canister) = result_info.storage_type{
            may_canister.expect("Result video info did not have bucket principal")
        } else{
            panic!("Send Storage type differs from returned storage type")
        };

        let video_actor = util::Actor{
            agent: video_backend.agent.clone(),
            principal: video_canister,
        };

        for (i, chunk) in chunks.iter().enumerate(){
            let chunk_data = Encode!(&i, &chunk).expect("Could not encode chunk");
            let response = video_actor.update_call("insert_chunk", chunk_data).await;
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
