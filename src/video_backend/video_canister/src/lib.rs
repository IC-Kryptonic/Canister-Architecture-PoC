use ic_cdk_macros::{update, query, init};
use ic_cdk::storage;
use ic_cdk::export::Principal;

use video_types::{VideoInfo, Chunk, Chunks, ChunkNum, StorageType, Comment, MAX_COMMENT_LENGTH};

use std::collections::{HashSet, HashMap};

pub type Comments = HashMap<Principal, String>;

struct MetaInformation{
    pub owner: Option<Principal>,
    pub creator: Principal,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
    pub thumbnail: Vec<u8>,
    pub views: usize,
    pub likes: HashSet<Principal>,
}

impl Default for MetaInformation{
    fn default() -> Self {
        MetaInformation{
            owner: None,
            creator: Principal::anonymous(),
            name: "".to_string(),
            description: "".to_string(),
            keywords: vec![],
            thumbnail: vec![],
            views: 0,
            likes: Default::default(),
        }
    }
}

#[init]
pub async fn init(video_info: VideoInfo){
    let chunk_num = match video_info.storage_type{
        StorageType::Canister(chunk_num, _maybe_princ) => chunk_num,
        StorageType::IPFS(_ipfs_data) => ic_cdk::trap("Video canister creation called with ipfs data"),
    };

    let chunk_store = storage::get_mut::<Chunks>();
    let mut empty_chunks: Chunks = vec![Vec::new(); chunk_num];
    chunk_store.append(&mut empty_chunks);

    let mut meta_info = MetaInformation{
        owner: None,
        creator: video_info.creator,
        name: video_info.name,
        description: video_info.description,
        keywords: video_info.keywords,
        thumbnail: video_info.thumbnail,
        views: 0,
        likes: HashSet::new(),
    };
    let meta_storage = storage::get_mut::<MetaInformation>();
    std::mem::swap(meta_storage, &mut meta_info);
}

///Inserts a new chunk
#[update]
pub async fn insert_chunk(chunk_num: ChunkNum, chunk: Chunk){
    let chunk_store = storage::get_mut::<Chunks>();

    chunk_store[chunk_num] = chunk;
}

///Retrieve a chunk
#[query]
pub async fn get_chunk(chunk_num: ChunkNum) -> Option<&'static Chunk>{
    let chunks = storage::get::<Chunks>();

    return chunks.get(chunk_num).and_then( |chunk| {
        if chunk.len() == 0 {

            if chunk_num == 0 { //Count first chunk as a view
                storage::get_mut::<MetaInformation>().views += 1;
            }

            None
        } else {
            Some(chunk)
        }
    });
}

#[query]
pub async fn get_info() -> VideoInfo{
    let meta_info = storage::get::<MetaInformation>();
    let chunks = storage::get::<Chunks>();

    return VideoInfo{
        owner: meta_info.owner.unwrap_or(meta_info.creator),
        creator: meta_info.creator,
        name: meta_info.name.clone(),
        description: meta_info.description.clone(),
        keywords: meta_info.keywords.clone(),
        thumbnail: meta_info.thumbnail.clone(),
        storage_type: StorageType::Canister(chunks.len(), Some(ic_cdk::id())),
        views: meta_info.views,
        likes: meta_info.likes.len(),
    }
}

#[update]
pub async fn add_like(){
    storage::get_mut::<MetaInformation>().likes.insert(ic_cdk::caller());
}

#[update]
pub async fn add_comment(comment: String){
    if comment.len() > MAX_COMMENT_LENGTH {
        ic_cdk::trap(&format!("Comment length above max allowed length({})", MAX_COMMENT_LENGTH))
    }

    storage::get_mut::<Comments>().insert(ic_cdk::caller(), comment);
}

#[query]
pub async fn get_comment(user: Principal) -> Option<String>{
    return storage::get::<Comments>().get_key_value(&user).map(
        |(_, string)| {
            return string.clone();
        });
}

#[query]
pub async fn get_comments(amount: usize) -> Vec<Comment>{
    let mut comments = Vec::with_capacity(amount);

    for (i, comment) in storage::get::<Comments>().iter().enumerate(){
        if i == amount {
            break;
        } else {
            comments.push((comment.0.clone(), comment.1.clone()));
        }
    }

    return comments;
}