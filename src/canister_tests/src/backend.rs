use ic_agent::{Agent};
use ic_agent::export::Principal;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::candid::{Encode, Decode};

use crate::util::Actor;

pub type VideoId = String;
pub type ChunkNum = usize;

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct Chunk{
    data: Vec<u8>,
    num: ChunkNum,
}

#[derive(Clone, CandidType, Deserialize, Debug)]
pub struct IPFSData{
    data: String,
}

#[derive(CandidType, Deserialize, Debug)]
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

    fn ne(&self, other: &Self) -> bool {
        !self.eq(other)
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

const TEST_STORAGE_TYPE: StorageType = StorageType::SimpleDistMap(1, None);



pub async fn test_backend(agent: &Agent) -> bool{

    let actor = Actor::from_name(agent, "backend");

    return if test_create_video(&actor).await && test_create_and_get_video_info(&actor).await && test_bucket_store_video(&actor).await {
        println!("All backend tests successful ✅");
        true
    } else {
        false
    }
}

async fn test_create_and_get_video_info(actor: &Actor<'_>) -> bool{

    let test_video_info = create_test_video();

    let create_args = Encode!(&test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", create_args).await;

    let result_id = match create_response {
        Ok(result) => Decode!(result.as_slice(), VideoInfo).expect("Could not deduce video info from result").video_id.expect("Video Id was not send back"),
        Err(err) => {
            println!("Api Call error: {:?}", err);
            return false;
        },
    };

    let get_arg = Encode!(&result_id).expect("Could not encode video_id");

    let get_response = actor.query_call("getVideoInfo", get_arg).await;

    let get_result = match get_response {
        Ok(result) => Decode!(result.as_slice(), WrappedVideoInfo).expect("Could not deduce video info from result").expect("Video was not in canister"),
        Err(err) => {
            println!("Api Call error: {:?}", err);
            return false;
        },
    };

    assert_eq!(result_id, get_result.video_id.expect("Video Id not in get_result"));
    assert_eq!(test_video_info.storage_type, get_result.storage_type);
    assert_eq!(test_video_info.keywords, get_result.keywords);
    assert_eq!(test_video_info.description, get_result.description);
    assert_eq!(test_video_info.name, get_result.name);

    return true;
}

async fn test_create_video(actor: &Actor<'_>) -> bool{

    let test_video_info = create_test_video();

    let arg = Encode!(&test_video_info).expect("Could not encode args");

    let response = actor.update_call("createVideo", arg).await;

    let result_video = match response {
        Ok(result) => Decode!(result.as_slice(), VideoInfo).expect("Could not deduce video info from result"),
        Err(err) => {
            println!("Api Call error: {:?}", err);
            return false;
        },
    };

    assert!(result_video.video_id.is_some());
    assert_eq!(result_video.owner, result_video.creator);
    assert_eq!(test_video_info.name, result_video.name);
    assert_eq!(test_video_info.description, result_video.description);
    assert_eq!(test_video_info.keywords, result_video.keywords);
    assert_eq!(test_video_info.storage_type, result_video.storage_type);

    return true;
}

/*async fn test_store_video(actor: &Actor<'_>) -> bool{

    let test_video_info = create_test_video();

    let create_args = Encode!(&test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", vec![create_args]).await;

    let result = match create_response {
        Ok(result) => Decode!(result.as_slice(), VideoInfo).expect("Could not deduce video info from result"),
        Err(err) => {
            println!("Api Call error: {:?}", err);
            return false;
        },
    };

    let result_id = result.video_id.expect("Video id not in result");

    let video_data = VideoData::InCanister(Chunk {
        data: [0xCA, 0xFF, 0xEE].try_into().expect("Could not convert array"),
        num: 0
    });

    let id_arg = Encode!(&result_id).expect("Id could not be encoded");

    let video_raw_arg = Encode!(&video_data).expect("Could not encode data");

    let store_response = actor.update_call("storeVideo", vec![id_arg, video_raw_arg]).await;

    return match store_response {
        Ok(vec) => {
            println!("{:?}", vec);
            true
        },
        Err(err) => {
            println!("Api Call error: {:?}", err);
            false
        },
    };
}*/

async fn test_bucket_store_video(actor: &Actor<'_>) -> bool{

    let test_video_info = create_test_video();

    let create_args = Encode!(&test_video_info).expect("Could not encode video_info");

    let create_response = actor.update_call("createVideo", create_args).await;

    let result = match create_response {
        Ok(result) => Decode!(result.as_slice(), VideoInfo).expect("Could not deduce video info from result"),
        Err(err) => {
            println!("Api Call error: {:?}", err);
            return false;
        },
    };

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

    return match store_response {
        Ok(vec) => {
            Decode!(vec.as_slice(), ()).expect("Could not decode store result correctly");
            true
        },
        Err(err) => {
            println!("Api Call error: {:?}", err);
            false
        },
    };
}



fn create_test_video() -> VideoInfo{
    VideoInfo{
        video_id: None,
        owner: Principal::from_slice(&[]),
        creator: Principal::from_slice(&[]),
        name: String::from("testing_name"),
        description: String::from("testing_desc"),
        keywords: vec!["testing_keyword1".to_string(), "testing_keyword2".to_string()],
        storage_type: TEST_STORAGE_TYPE,
    }
}