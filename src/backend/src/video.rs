use ic_cdk::export::candid::{{CandidType, Deserialize}, Principal};
use ic_cdk::storage;
use ic_cdk_macros::*;
use std::collections::HashMap;

pub mod video_storage;

pub type VideoInfoStore = HashMap<VideoId, VideoInfo>;
pub type VideoId = String;
pub type Feed = Vec<VideoInfo>;


#[derive(Clone, CandidType, Deserialize)]
pub struct VideoInfo{
    pub video_id: Option<VideoId>,
    pub owner: Principal,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
    pub storage_type: video_storage::StorageType,
}


///This function returns a wrapped video if there is one for this id, otherwise it return [None].
#[query(name = "getVideoInfo")]
pub fn get_video_info(id: VideoId) -> Option<VideoInfo> {
    let video_store = storage::get::<VideoInfoStore>();

    video_store
        .get(&id)
        .cloned()
}

///This function creates a new Video based on the video information of the argument.
///It returns the newly generated id of the function.
#[update(name = "createVideo")]
pub async fn create_video(mut video: VideoInfo) -> VideoId{
    let info_store = storage::get_mut::<VideoInfoStore>();
    
    let id = loop{
        let generated = generate_video_id(&video);
        if !info_store.contains_key(&generated){
            break generated;
        }
    };

    video.video_id = Some(id.clone());

    video.owner = if cfg!(target_arch = "wasm32"){
        ic_cdk::caller()
    } else {
        Principal::from_slice(&[])
    };

    video_storage::create_video(id.clone(), &video.storage_type).await;

    info_store.insert(id.clone(), video);
    return id;
}

///This function takes a data from video that should be stored and adds it to the appropiate
///storage.
#[update(name = "storeVideo")]
pub fn store_video(video_id: VideoId, data: video_storage::VideoData){
    video_storage::store_video(video_id, data);
}

///This function retrieves video storage data.
///If the video or data does not exist it returns [None].
#[query(name = "loadVideo")]
pub fn load_video(video_id: VideoId, load_info: video_storage::LoadInfo) -> Option<video_storage::VideoData>{
    video_storage::load_video(video_id, load_info)
}

///This funtion retrieves the specified number of [VideoInfo] and returns them as a [Feed].
#[query(name = "getDefaultFeed")]
pub fn get_default_feed(num: usize) -> Feed{
    let video_store = storage::get::<VideoInfoStore>();

    video_store
        .values()
        .cloned()
        .take(num)
        .collect()
}

///This function searches for the specified [String] in names, descriptions and keywords of videos
///and return the first one found. It ignores case.
///If no video can be found it returns [None] Otherwise it returns the wrapped video.
#[query(name = "searchVideo")]
pub fn search_video(to_search: String) -> Option<&'static VideoInfo> {
    let to_search = to_search.to_lowercase();
    let video_store = storage::get::<VideoInfoStore>();

    for (_, v) in video_store.iter() {
        if v.name.to_lowercase().contains(&to_search) || v.description.to_lowercase().contains(&to_search) {
            return Some(v);
        }

        for word in v.keywords.iter() {
            if word.to_lowercase() == to_search {
                return Some(v);
            }
        }
    }

    None
}

///Stores the videos into the stable storage before an upgrade
/*#[pre_upgrade]
pub fn pre_upgrade() {
    let video_infos = storage::get_mut::<VideoInfoStore>();
    let video_chunks = storage::get_mut::<video_storage::local::ChunkStore>();

    let combined: Vec<(VideoInfo, video_storage::local::Chunks)> = video_infos
        .drain()
        .map(|(id, video_info)| (video_info, video_chunks.remove(&id).unwrap()))
        .collect();

    storage::stable_save((combined,)).unwrap();
}

///Loads the videos from stable storage after an upgrade
#[post_upgrade]
pub fn post_upgrade() {
    let (combined_store,): (Vec<(VideoInfo, video_storage::local::Chunks)>, ) = storage::stable_restore().unwrap();
    
    let video_info_store = storage::get_mut::<VideoInfoStore>();
    let chunks_store = storage::get_mut::<video_storage::local::ChunkStore>();

    video_info_store.reserve(combined_store.len());
    chunks_store.reserve(combined_store.len());

    for (video_info, chunks) in combined_store {
        let id = video_info.video_id.clone();
        video_info_store.insert(id.clone().unwrap(), video_info);
        chunks_store.insert(id.unwrap(), chunks);
    }
}*/

///This function generates a id based on the information of the Video and a timestamp.
fn generate_video_id(info: &VideoInfo) -> VideoId{
    let time = if cfg!(target_arch = "wasm32"){
        ic_cdk::api::time() as u64
    } else {
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_secs() //for testing when not in canister 
    };


    let name = info.name.clone();

    return format!("{}{}", name, time);
}
