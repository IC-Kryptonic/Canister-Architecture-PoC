use ic_cdk::storage;
use ic_cdk_macros::*;

pub mod video;
pub mod profile;

///This function completely resets the storage.
#[update(name = "reset")]
pub fn reset(){
    storage::delete::<video::VideoInfoStore>();
    storage::delete::<video::ChunkStore>();
    storage::delete::<profile::ProfileStore>();
}