use ic_cdk::export::candid::{Principal};
use ic_cdk::storage;
use ic_cdk_macros::{query, update};

use std::collections::{HashMap, HashSet};

use video_types::{Profile};

pub type ProfileStore = HashMap<Principal, Profile>;

///This function returns a Profile if there is one for the principal, otherwise it returns creates a new one just with the principal and the name as an empty string.
#[query(name = "get_profile")]
pub fn get_profile(id: Principal) -> &'static Profile {
    check_profile(&id);

    return &storage::get::<ProfileStore>()[&id];
}

///This function creates a new profile or replaces an old one
#[update(name = "put_profile")]
pub fn put_profile(mut profile: Profile){
    let caller = ic_cdk::caller();

    profile.principal = caller.clone();

    let profile_store = storage::get_mut::<ProfileStore>();

    match profile_store.get_mut(&caller){
        None => {
            profile.viewed = HashSet::new();
            profile.comments = HashSet::new();
            profile.likes = HashSet::new();

            profile_store.insert(caller, profile);
        }
        Some( existing_profile) => {
            existing_profile.name = profile.name;
        }
    }
}

///Adds a like for the caller to the specified Video
#[update(name = "add_like")]
pub fn add_like(video_princ: Principal){
    let caller = ic_cdk::caller();
    check_profile(&caller);

    let profile_store = storage::get_mut::<ProfileStore>();
    profile_store.get_mut(&caller).expect("Profile not stored").likes.insert(video_princ);
}

///Add comment for the caller to his profile
#[update(name = "add_comment")]
pub fn add_comment(video_princ: Principal){
    let caller = ic_cdk::caller();
    check_profile(&caller);

    let profile_store = storage::get_mut::<ProfileStore>();
    profile_store.get_mut(&caller).expect("Profile not stored").comments.insert(video_princ);
}

///Add a video that was already viewed
#[update(name = "add_view")]
pub fn add_view(video_princ: Principal){
    let caller = ic_cdk::caller();
    check_profile(&caller);

    let profile_store = storage::get_mut::<ProfileStore>();
    profile_store.get_mut(&caller).expect("Profile not stored").viewed.insert(video_princ);
}

fn check_profile(princ: &Principal){
    let profile_store = storage::get_mut::<ProfileStore>();

    if !profile_store.contains_key(princ) {

        profile_store.insert(
            princ.clone(),
            Profile {
                principal: princ.clone(),
                name: "anon".to_string(),
                likes: Default::default(),
                comments: Default::default(),
                viewed: Default::default(),
            }
        );
    }
}