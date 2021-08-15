use ic_cdk::export::candid::{{CandidType, Deserialize}, Principal};
use ic_cdk::storage;
use ic_cdk_macros::*;

use std::collections::HashMap;
use std::collections::HashSet;

use crate::video::VideoId;

pub type ProfileStore = HashMap<Principal, Profile>;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Profile{
    pub principal: Principal,
    pub name: String,
    pub likes: HashSet<VideoId>
}

///This function returns a wrapped Profile if there is one for the principal, otherwise it returns [None].
#[query(name = "getProfile")]
pub fn get_profile(id: Principal) -> Option<&'static Profile> {
    let profile_store = storage::get::<ProfileStore>();

    profile_store
        .get(&id)
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
pub fn create_profile(mut profile: Profile){
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = get_caller_principal();
    profile.principal = caller.clone();

    profile_store.insert(caller, profile);
}

///Adds a like for the caller to the specified Video
#[update(name = "likeVideo")]
pub fn like_video(video_id: VideoId){
    let profile_store = storage::get_mut::<ProfileStore>();

    let caller = get_caller_principal();

    profile_store
        .get_mut(&caller)
        .unwrap()
        .likes
        .insert(video_id);
}

///Retrieves the amount of likes for a specific video
#[query(name = "getLikeAmount")]
pub fn get_like_amount(video_id: VideoId) -> usize{
    let profile_store = storage::get_mut::<ProfileStore>();

    let mut count = 0;

    profile_store
        .values()
        .for_each(|profile| {
            if profile.likes.contains(&video_id){
                count += 1;
            }
        });

    return count;
}

///Function for getting the Principal who called the canister
fn get_caller_principal() -> Principal{
    if cfg!(target_arch = "wasm32"){
        ic_cdk::caller()
    } else {
        Principal::from_slice(&[])
    }
}
