use ic_cdk::export::candid::{
    Principal, {CandidType, Deserialize},
};
use ic_cdk::storage;
use ic_cdk_macros::*;

use crate::video::VideoId;
use std::collections::HashMap;
use std::collections::HashSet;

pub type ProfileStore = HashMap<Principal, Profile>;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Profile {
    pub principal: Principal,
    pub name: String,
    pub bio: String,
    pub likes: HashSet<VideoId>,
    pub follows: HashSet<Principal>,
    pub followers: HashSet<Principal>,
}

// Used via the UpdateProfile dialog
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ProfileUpdate {
    pub name: String,
    pub bio: String,
}

///This function returns a wrapped Profile if there is one for the principal, otherwise it returns [None].
#[query(name = "getProfile")]
pub fn get_profile(id: Principal) -> Option<&'static Profile> {
    let profile_store = storage::get::<ProfileStore>();

    profile_store.get(&id)
}

///This function returns a wrapped Profile if there is one for the caller, otherwise it returns [None].
#[query(name = "getCurrentProfile")]
pub fn get_current_profile() -> Option<&'static Profile> {
    let profile_store = storage::get::<ProfileStore>();

    let caller = get_caller_principal();

    profile_store.get(&caller)
}

///This function creates a new based on the video information of the argument.
///It returns the newly generated id of the function.
#[update(name = "createProfile")]
pub fn create_profile() {
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = get_caller_principal();

    // If profile already exists don't create a new one
    match get_profile(caller) {
        Some(_profile) => {
            println!("Profile {} already exists", caller.to_text());
            return;
        }
        None => {}
    }

    let profile = Profile {
        principal: caller,
        name: caller.to_text(),
        bio: "Enter your bio here :)".to_owned(),
        likes: HashSet::new(),
        follows: HashSet::new(),
        followers: HashSet::new(),
    };

    profile_store.insert(caller, profile);
}

#[update(name = "updateProfile")]
pub fn update_profile(update: ProfileUpdate) {
    let profile_store = storage::get_mut::<ProfileStore>();
    let caller = get_caller_principal();

    profile_store.get_mut(&caller).unwrap().name = update.name;

    profile_store.get_mut(&caller).unwrap().bio = update.bio;
}

///Adds a like for the caller to the specified Video
#[update(name = "likeVideo")]
pub fn like_video(video_id: VideoId) {
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = get_caller_principal();

    profile_store
        .get_mut(&caller)
        .unwrap()
        .likes
        .insert(video_id);
}

#[update(name = "followProfile")]
pub fn follow_profile(principal: Principal) {
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = get_caller_principal();

    profile_store
        .get_mut(&principal)
        .unwrap()
        .followers
        .insert(caller);

    profile_store
        .get_mut(&caller)
        .unwrap()
        .follows
        .insert(principal);
}

#[update(name = "unfollowProfile")]
pub fn unfollow_profile(principal: Principal) {
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = get_caller_principal();

    profile_store
        .get_mut(&principal)
        .unwrap()
        .followers
        .remove(&caller);

    profile_store
        .get_mut(&caller)
        .unwrap()
        .follows
        .remove(&principal);
}

///Retrieves the amount of likes for a specific video
#[query(name = "getLikeAmount")]
pub fn get_like_amount(video_id: VideoId) -> usize {
    let profile_store = storage::get_mut::<ProfileStore>();

    let mut count = 0;

    profile_store.values().for_each(|profile| {
        if profile.likes.contains(&video_id) {
            count += 1;
        }
    });

    return count;
}

///Function for getting the Principal who called the canister
fn get_caller_principal() -> Principal {
    if cfg!(target_arch = "wasm32") {
        ic_cdk::caller()
    } else {
        Principal::from_slice(&[])
    }
}
