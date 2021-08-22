use ic_agent::{Agent};
use ic_agent::export::Principal;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::candid::{Encode, Decode};

use crate::util::Actor;


pub type VideoId = String;
pub type ChunkNum = usize;

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
            StorageType::SimpleDistMap(_chunks, _bucket) => unimplemented!(),
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


pub async fn test_backend(agent: &Agent) -> bool{

    let actor = Actor::from_name(agent, "backend");

    if !test_create_video(&actor).await{
        return false;
    }

    println!("All backend tests successful ✅");
    return true;
}

async fn test_create_video(actor: &Actor<'_>) -> bool{

    let storage_type = StorageType::InCanister(1);

    let video_info = VideoInfo{
        video_id: None,
        owner: Principal::from_slice(&[]),
        creator: Principal::from_slice(&[]),
        name: "testing_name".to_string(),
        description: "testing_desc".to_string(),
        keywords: vec!["testing_keyword1".to_string(), "testing_keyword2".to_string()],
        storage_type,
    };

    let args = Encode!(&video_info).expect("Could not encode args");

    let response = actor.update_call("createVideo", args).await;

    let result_video = match response {
        Ok(result) => Decode!(result.as_slice(), VideoInfo).expect("Could not deduce video info from result"),
        Err(err) => {
            println!("Api Call error: {:?}", err);
            return false;
        },
    };

    assert!(result_video.video_id.is_some());
    assert_eq!(result_video.owner, result_video.creator);
    assert_eq!(video_info.name, result_video.name);
    assert_eq!(video_info.description, result_video.description);
    assert_eq!(video_info.keywords, result_video.keywords);
    assert_eq!(video_info.storage_type, result_video.storage_type);

    return true;
}
