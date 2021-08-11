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
///It returns all the meta information for the video.
#[update(name = "createVideo")]
pub async fn create_video(mut video: VideoInfo) -> &'static VideoInfo{
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

    video_storage::create_video(&mut video).await;

    info_store.insert(id.clone(), video);
    return &info_store[&id];
}

///This function takes a data from video that should be stored and adds it to the appropriate
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

///This function searches for the specified [String] in names, descriptions and keywords of videos
///and return a feed of the found videos. It ignores case.
#[query(name = "searchFeed")]
pub fn search_feed(to_search: String) -> Vec<&'static VideoInfo> {
    let to_search = to_search.to_lowercase();
    let video_store = storage::get::<VideoInfoStore>();

    let mut found_videos = Vec::new();

    for (_, v) in video_store.iter() {
        if v.name.to_lowercase().contains(&to_search) || v.description.to_lowercase().contains(&to_search) {
            found_videos.push(v);
            continue;
        }

        for word in v.keywords.iter() {
            if word.to_lowercase() == to_search {
                found_videos.push(v);
                continue;
            }
        }
    }

    return found_videos;
}


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
