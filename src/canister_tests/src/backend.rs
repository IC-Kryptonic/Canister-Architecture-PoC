use ic_agent::export::Principal;
use ic_agent::AgentError;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::candid::{Encode, Decode};

use crate::util::Actor;
use crate::util;
use std::convert::TryInto;

pub type VideoId = String;
pub type ChunkNum = usize;

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct Chunk{
    data: Vec<u8>,
    num: ChunkNum,
}

impl PartialEq for Chunk{
    fn eq(&self, other: &Self) -> bool {
        self.data == other.data && self.num == other.num
    }
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct IPFSData{
    data: String,
}

#[derive(CandidType, Deserialize, Debug, Clone)]
pub enum StorageType{
    #[serde(rename = "inCanister")]
    InCanister(ChunkNum),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap(ChunkNum, Option<Principal>),
    #[serde(rename = "ipfs")]
    IPFS(IPFSData),
}

#[derive(CandidType, Deserialize, Debug)]
pub enum VideoData{
    #[serde(rename = "inCanister")]
    InCanister(Chunk),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap(Principal),
    #[serde(rename = "ipfs")]
    IPFS(IPFSData),
}

#[derive(CandidType, Deserialize)]
pub enum LoadInfo{
    #[serde(rename = "inCanister")]
    InCanister(ChunkNum),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap,
    #[serde(rename = "ipfs")]
    IPFS,
}

impl PartialEq for StorageType{
    fn eq(&self, other: &Self) -> bool {
        return match self{
            StorageType::InCanister(chunks) => {
                if let StorageType::InCanister(other_chunks) = other {
                    other_chunks == chunks
                } else{
                    false
                }
            },
            StorageType::SimpleDistMap(chunks, _bucket) => {
                if let StorageType::SimpleDistMap(other_chunks, _other_bucket ) = other {
                    other_chunks == chunks
                } else{
                    false
                }
            },
            StorageType::IPFS(_data) => unimplemented!(),
        }
    }
}

impl PartialEq for VideoData{
    fn eq(&self, other: &Self) -> bool {
        return match self{
            VideoData::InCanister(chunk) => {
                if let VideoData::InCanister(other_chunk) = other {
                    other_chunk == chunk
                } else{
                    false
                }
            },
            VideoData::SimpleDistMap(bucket) => {
                if let VideoData::SimpleDistMap(other_bucket ) = other {
                    bucket == other_bucket
                } else{
                    false
                }
            },
            VideoData::IPFS(_data) => unimplemented!(),
        }
    }
}

#[derive(CandidType, Deserialize)]
pub struct VideoInfo{
    pub video_id: Option<VideoId>,
    pub owner: Principal,
    pub creator: Principal,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
    pub storage_type: StorageType,
}

pub type WrappedVideoInfo = Option<VideoInfo>;


#[tokio::test]
async fn test_create_and_get_video_info() -> Result<(), String>{

    let actor = Actor::from_name("backend").await;

    let test_video_info = create_test_video(StorageType::InCanister(1));

    let create_args = Encode!(&test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", create_args).await;

    let raw_result = util::check_ok(create_response);
    let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

    let result_id = result.video_id.expect("Video id not in result");

    let get_arg = Encode!(&result_id).expect("Could not encode video_id");

    let get_response = actor.query_call("getVideoInfo", get_arg).await;

    let raw_get_result = util::check_ok(get_response);

    let get_result = Decode!(raw_get_result.as_slice(), WrappedVideoInfo).expect("Could not deduce video info from result").expect("Video was not in canister");

    assert_eq!(result_id, get_result.video_id.expect("Video Id not in get_result"));
    assert_eq!(test_video_info.storage_type, get_result.storage_type);
    assert_eq!(test_video_info.keywords, get_result.keywords);
    assert_eq!(test_video_info.description, get_result.description);
    assert_eq!(test_video_info.name, get_result.name);

    Ok(())
}

#[tokio::test]
async fn test_create_video() -> Result<(), String>{

    let actor = Actor::from_name("backend").await;

    let test_video_info = create_test_video(StorageType::InCanister(1));

    let arg = Encode!(&test_video_info).expect("Could not encode args");

    let response = actor.update_call("createVideo", arg).await;

    let raw_result = util::check_ok(response);
    let result_video = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

    assert!(result_video.video_id.is_some());
    assert_eq!(result_video.owner, result_video.creator);
    assert_eq!(test_video_info.name, result_video.name);
    assert_eq!(test_video_info.description, result_video.description);
    assert_eq!(test_video_info.keywords, result_video.keywords);
    assert_eq!(test_video_info.storage_type, result_video.storage_type);

    return Ok(());
}

#[tokio::test]
async fn test_store_video() -> Result<(), String>{

    let actor = Actor::from_name("backend").await;

    let test_video_info = create_test_video(StorageType::InCanister(1));

    let create_args = Encode!(&test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", create_args).await;

    let raw_result = util::check_ok(create_response);
    let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

    let result_id = result.video_id.expect("Video id not in result");

    let video_data = VideoData::InCanister(Chunk {
        data: [0xCA, 0xFF, 0xEE].try_into().expect("Could not convert array"),
        num: 0
    });

    let store_args = Encode!(&result_id, &video_data).expect("store args could not be encoded");

    let store_response = actor.update_call("storeVideo", store_args).await;

    let raw_result = util::check_ok(store_response);
    Decode!(raw_result.as_slice(), ()).expect("Could not decode store result correctly");

    Ok(())
}


#[tokio::test]
async fn test_store_and_load_video() -> Result<(), String>{

    //Setup
    let actor = Actor::from_name("backend").await;

    let test_video_info = create_test_video(StorageType::InCanister(1));

    let create_args = Encode!(&test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", create_args).await;

    let raw_result = util::check_ok(create_response);
    let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

    let result_id = result.video_id.expect("Video id not in result");

    let video_data = VideoData::InCanister(Chunk {
        data: [0xCA, 0xFF, 0xEE].try_into().expect("Could not convert array"),
        num: 0
    });

    let store_args = Encode!(&result_id, &video_data).expect("store args could not be encoded");

    let store_response = actor.update_call("storeVideo", store_args).await;

    let raw_result = util::check_ok(store_response);
    Decode!(raw_result.as_slice(), ()).expect("Could not decode store result correctly");


    //Act
    let load_args = Encode!(&result_id, &LoadInfo::InCanister(0)).expect("Could not encode load args");

    let load_response = actor.query_call("loadVideo", load_args).await;

    let raw_result = util::check_ok(load_response);
    let result = Decode!(raw_result.as_slice(), Option<VideoData>).expect("Could not decode load result correctly");

    //Test
    let result_video_data = result.expect("Video data is not in canister");
    assert_eq!(result_video_data, video_data);

    Ok(())
}


#[tokio::test]
async fn test_bucket_store_new_video() -> Result<(), String>{

    let actor = Actor::from_name("backend").await;

    let test_video_info = create_test_video(StorageType::SimpleDistMap(1, None));

    let create_args = Encode!(&test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", create_args).await;

    let raw_result = util::check_ok(create_response);
    let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

    let result_id = result.video_id.expect("Video id not in result");
    let bucket = if let StorageType::SimpleDistMap(_chunk, may_bucket) = result.storage_type{
        may_bucket.expect("Result did not include bucket principal")
    } else{
        panic!("Wrong storage type returned");
    };
    let video_data: [u8; 3] = [0xCA, 0xFF, 0xEE];

    let store_arg = Encode!(&result_id, &0u64, &video_data).expect("Could not encode store data");

    let bucket_actor = Actor{
        agent: actor.agent,
        principal: bucket,
    };

    let store_response = bucket_actor.update_call("insertChunk", store_arg).await;


    let raw_result = util::check_ok(store_response);
    Decode!(raw_result.as_slice(), ()).expect("Could not decode store result correctly");

    Ok(())
}


#[tokio::test]
async fn test_nonsense_video_creation() -> Result<(), String>{

    let actor = Actor::from_name("backend").await;

    let nonsense_test_video_info = [0xCA, 0xFF, 0xEE];

    let create_args = Encode!(&nonsense_test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", create_args).await;

    let error = util::check_err(create_response);

    if matches!(error, AgentError::ReplicaError{
        reject_code: 5,
        reject_message: _,
    }){
        Ok(())
    } else{
        Err(format!("{:?}", error))
    }
}


fn create_test_video(storage_type: StorageType) -> VideoInfo{
    VideoInfo{
        video_id: None,
        owner: Principal::from_slice(&[]),
        creator: Principal::from_slice(&[]),
        name: String::from("testing_name"),
        description: String::from("testing_desc"),
        keywords: vec!["testing_keyword1".to_string(), "testing_keyword2".to_string()],
        storage_type,
    }
}