use ic_cdk::export::candid::{Principal};
use ic_cdk_macros::{update, query};
use ic_cdk::storage;
use ic_cdk::api::call;

use video_types::{Profile, VideoInfo};
use std::collections::{HashMap};

pub type AdCache = HashMap<Principal, VideoInfo>;

const PROFILE_PRINCIPAL: &str = env!("CANISTER_ID_profile_backend");

#[update]
pub async fn add_ad(video_canister: Principal){
    let video_info = get_video_info(video_canister).await;

    storage::get_mut::<AdCache>().insert(video_canister, video_info);
}

#[query]
pub async fn get_random_ad_principal() -> Option<Principal>{
    let ads = storage::get::<AdCache>();

    return if ads.is_empty(){
        None
    } else {
        let i = ic_cdk::api::time() as usize % ads.len();   //rand crate not supported even with js enabled for wasm, so we use time to generate random values

        for (j, ad) in ads.keys().enumerate(){
            if i == j{
                return Some(ad.clone());    //TODO find something more efficient, this is horrible
            }
        }
        panic!("This should not happen");
    }
}

#[query]
pub async fn get_ad_principal_for_user(user: Principal) -> Option<Principal>{
    return if let Some(profile) = get_profile(user).await {
        let ads = storage::get::<AdCache>();

        for (princ, info) in ads {
            if profile.name == info.name {   //TODO make something less dumb
                return Some(princ.clone());
            }
        }
        get_random_ad_principal().await
    } else {
        ic_cdk::api::print("No user profile found defaulting to random ad");
        get_random_ad_principal().await
    }
}

async fn get_profile(princ: Principal) -> Option<Profile>{
    let profile_canister = Principal::from_text(PROFILE_PRINCIPAL.clone()).expect("Couldn't deduce Principal from profile canister id text");

    let response: Result<(Option<Profile>,), _> = call::call( profile_canister, "get_profile", (princ,)).await;

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