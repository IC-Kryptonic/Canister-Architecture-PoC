use ic_cdk::storage;
use ic_cdk_macros::{update, query};
use ic_cdk::export::candid::{Encode, Principal};
use ic_cdk::api::call;

use std::collections::HashMap;

use video_types::{VideoInfo, CreateCanisterResult, InstallCodeArg, InstallMode, StorageType, Feed, Profile};

pub type VideoCache = HashMap<Principal, VideoInfo>;

static VIDEO_CANISTER_CODE: &[u8;  include_bytes!("../../../target/wasm32-unknown-unknown/release/video_canister_opt.wasm").len()] = include_bytes!("../../../target/wasm32-unknown-unknown/release/video_canister_opt.wasm");
static PROFILE_PRINCIPAL: &str = env!("CANISTER_ID_profile_backend");

///Creates a new Video based on the video information of the argument.
///It returns all the meta information for the video.
#[update]
pub async fn create_video(mut video: VideoInfo, save: bool) -> VideoInfo{

    video.creator = ic_cdk::caller();

    if let StorageType::Canister(chunk_num, _) = video.storage_type{
        let new_canister = create_canister().await;
        video.storage_type = StorageType::Canister(chunk_num, Some(new_canister.clone()));
        install_video_canister(&new_canister, &video).await;

        if save {
            let store = storage::get_mut::<VideoCache>();
            store.insert(new_canister.clone(), video.clone());
        }
        return video;

    } else {
        unimplemented!("Only canister storage implemented atm");
    }
}

#[update]
pub async fn update_cache(video_princ: Principal){
    let new_info = get_video_info(video_princ.clone()).await;

    storage::get_mut::<VideoCache>().insert(video_princ, new_info);
}

#[query]
pub async fn get_random_feed(num: usize) -> Feed{
    return storage::get::<VideoCache>().keys().take(num).map(|princ| princ.clone()).collect();
}

///Returns a random [Feed] of videos the specified user has not watched yet
#[query]
pub async fn get_user_feed(num: usize, user: Principal) -> Feed{
    let profile = get_profile(user).await;

    return if let profile = Some(profile) {
        let videos = storage::get::<VideoCache>();

        let mut feed = Vec::with_capacity(num);

        for (video_princ, _) in videos {
            if feed.len() >= num {
                break;
            }

            if !profile.viewed.contains(video_princ) {
                feed.push(video_princ.clone())
            }
        }

        feed
    } else {
        get_random_feed(num)
    };
}

#[query]
pub async fn get_search_feed(num: usize, to_search: String) -> Feed{
    let to_search = to_search.to_lowercase();
    let video_store = storage::get::<VideoCache>();

    let mut found_videos = Vec::with_capacity(num);

    for (princ, video) in video_store {
        if found_videos.len() >= num {
            break;
        }

        if video.name.to_lowercase().contains(&to_search) || video.description.to_lowercase().contains(&to_search) {
            found_videos.push(princ.clone());
            continue;
        }

        for word in video.keywords.iter() {
            if word.to_lowercase() == to_search {
                found_videos.push(princ.clone());
                continue;
            }
        }
    }

    return found_videos;
}

#[query]
pub async fn get_creator_feed(num: usize, creator: Principal) -> Feed{
    let video_store = storage::get::<VideoCache>();

    let mut found_videos = Vec::with_capacity(num);

    for (video_princ, info) in video_store{
        if found_videos.len() >= num {
            break;
        }

        if info.creator == creator{
            found_videos.push(video_princ.clone());
        }
    }

    return found_videos;
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

async fn install_video_canister(canister: &Principal, video_info: &VideoInfo){
    let manage_princ = Principal::management_canister();

    let encoded_arg = Encode!(video_info).expect("Could not encode video info");

    let install_arg = InstallCodeArg {
        mode: InstallMode::Install,
        canister_id: canister.clone(),
        wasm_module: VIDEO_CANISTER_CODE.to_vec(),
        arg: encoded_arg,
    };

    let response: Result<(), _> = call::call( manage_princ, "install_code", (install_arg,)).await;

    match response {
        Ok(_) => (),
        Err(err) => {
            ic_cdk::api::trap(format!("Could not install video_canister code into canister: {}", err.1).as_str());
        }
    }
}

async fn get_profile(princ: Principal) -> Option<Profile>{
    let profile_princ = Principal::from_text(PROFILE_PRINCIPAL.clone()).expect("Couldn't deduce Principal from profile canister id text");

    let response: Result<(Option<Profile>,), _> = call::call( profile_princ, "get_profile", (princ,)).await;

    match response{
        Ok((profile_res,)) => return profile_res,
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error getting profile with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}

async fn get_video_info(video_princ: Principal) -> VideoInfo{

    let response: Result<(VideoInfo,), _> = call::call( video_princ, "get_info", ()).await;

    match response{
        Ok((video_res,)) => return video_res,
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error getting video info with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}
