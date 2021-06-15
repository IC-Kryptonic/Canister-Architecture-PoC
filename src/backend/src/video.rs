use ic_cdk::export::candid::{{CandidType, Deserialize}, Principal};
use ic_cdk::storage;
use ic_cdk_macros::*;
use std::collections::HashMap;

pub type VideoInfoStore = HashMap<VideoId, VideoInfo>;
pub type VideoId = String;
pub type VideoChunk = Vec<u8>;
pub type VideoChunks = Vec<VideoChunk>;
pub type ChunkStore = HashMap<VideoId, VideoChunks>;
pub type Feed = Vec<VideoInfo>;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct VideoInfo{
    pub video_id: VideoId,
    pub owner: Principal,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
    pub chunk_count: usize,
}


///This function returns a wrapped video if there is one for this id, otherwise it return [None].
#[query(name = "getVideoInfo")]
pub fn get_video_info(id: VideoId) -> Option<VideoInfo> {
    let video_store = storage::get::<VideoInfoStore>();

    video_store
        .get(&id)
        .cloned()
}

///This function creates a new based on the video information of the argument.
///It returns the newly generated id of the function.
#[update(name = "createVideo")]
pub fn create_video(mut video: VideoInfo) -> VideoId{
    let info_store = storage::get_mut::<VideoInfoStore>();
    let chunk_store = storage::get_mut::<ChunkStore>();
    
    let id = loop{
        let generated = generate_video_id(&video);
        if !info_store.contains_key(&generated){
            break generated;
        }
    };

    video.video_id = id.clone();

    video.owner = if cfg!(target_arch = "wasm32"){
        ic_cdk::caller()
    } else {
        Principal::from_slice(&[])
    };

    chunk_store.insert(id.clone(), vec![Vec::new(); video.chunk_count]);
    info_store.insert(id.clone(), video);
    return id;
}

///This function takes a video chuk and adds it to the chunks for the video.
///It silently ignores chunks if the video does not exist.
#[update(name = "putChunk")]
pub fn put_chunk(chunk: Vec<u8>, chunk_num: usize, video_id: VideoId){
    if let Some(video_info) = storage::get::<VideoInfoStore>().get(&video_id){
        let sender  = if cfg!(target_arch = "wasm32"){
            ic_cdk::caller()
        } else {
            Principal::from_slice(&[])
        };

        if sender != video_info.owner{
            ic_cdk::api::print("Someone tried to upload a chunk to a video that is not theirs");
            return;
        }
    } else {
        ic_cdk::api::print("Someone tried to upload a chunk to a video that does not exist");
        return;
    }

    let chunk_store = storage::get_mut::<ChunkStore>();

    if let Some(video_chunks) = chunk_store.get_mut(&video_id){
        video_chunks[chunk_num] = chunk;
    }
}

///This function retrieves a wrapped video chunk.
///If the video or chunk does not exist it returns [None].
#[query(name = "getChunk")]
pub fn get_chunk(chunk_num: usize, video_id: VideoId) -> Option<&'static VideoChunk>{
    let chunk_store = storage::get::<ChunkStore>();

    if let Some(video_chunks) = chunk_store.get(&video_id){
        video_chunks
            .get(chunk_num)
    } else {
        None
    }
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

///This function completely resets the storage.
#[update(name = "reset")]
pub fn reset(){
    storage::delete::<VideoInfoStore>();
    storage::delete::<ChunkStore>();
}

///Stores the videos into the stable storage before an upgrade
#[pre_upgrade]
pub fn pre_upgrade() {
    let video_infos = storage::get_mut::<VideoInfoStore>();
    let video_chunks = storage::get_mut::<ChunkStore>();

    let combined: Vec<(VideoInfo, VideoChunks)> = video_infos
        .drain()
        .map(|(id, video_info)| (video_info, video_chunks.remove(&id).unwrap()))
        .collect();

    storage::stable_save((combined,)).unwrap();
}

///Loads the videos from stable storage after an upgrade
#[post_upgrade]
pub fn post_upgrade() {
    let (combined_store,): (Vec<(VideoInfo, VideoChunks)>, ) = storage::stable_restore().unwrap();
    
    let video_info_store = storage::get_mut::<VideoInfoStore>();
    let chunks_store = storage::get_mut::<ChunkStore>();

    video_info_store.reserve(combined_store.len());
    chunks_store.reserve(combined_store.len());

    for (video_info, chunks) in combined_store {
        let id = video_info.video_id.clone();
        video_info_store.insert(id.clone(), video_info);
        chunks_store.insert(id, chunks);
    }
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
