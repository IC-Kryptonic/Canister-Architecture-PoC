use ic_cdk::export::candid::{Principal};
use ic_cdk::storage;
use ic_cdk_macros::{query, update};

use std::collections::HashMap;

use video_types::{Profile};

pub type ProfileStore = HashMap<Principal, Profile>;

///This function returns a wrapped Profile if there is one for the principal, otherwise it returns [None].
#[query(name = "get_profile")]
pub fn get_profile(id: Principal) -> Option<&'static Profile> {
    return storage::get::<ProfileStore>().get(&id);
}

///This function creates a new profile or replaces an old one
#[update(name = "put_profile")]
pub fn put_profile(mut profile: Profile){
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = ic_cdk::caller();
    profile.principal = caller.clone();

    profile_store.insert(caller, profile);
}

///Adds a like for the caller to the specified Video
#[update(name = "add_like")]
pub fn add_like(video_princ: Principal){
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = ic_cdk::caller();

    profile_store
        .get_mut(&caller)
        .expect("Caller has not made a profile yet")
        .likes
        .insert(video_princ);
}

///Add comment for the caller to his profile
#[update(name = "add_comment")]
pub fn add_comment(video_princ: Principal){
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = ic_cdk::caller();

    profile_store
        .get_mut(&caller)
        .expect("Caller has not made a profile yet")
        .comments
        .insert(video_princ);
}

///Add a video that was already viewed
#[update(name = "add_view")]
pub fn add_view(video_princ: Principal){
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = ic_cdk::caller();

    match profile_store.get_mut(&caller){
        None => {
            ic_cdk::api::print("Caller has not made a profile yet, ignoring view")
        }
        Some(profile) => {
            profile.viewed.insert(video_princ);
        }
    }
}