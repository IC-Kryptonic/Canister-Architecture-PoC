use ic_agent::{Agent};
use ic_agent::export::Principal;
use ic_cdk::export::candid::{CandidType, Deserialize};
use ic_cdk::export::candid::{Encode, Decode};

use crate::util;


pub type VideoId = String;
pub type ChunkNum = usize;

#[derive(Clone, CandidType, Deserialize)]
pub struct IPFSData{
    data: String,
}

#[derive(CandidType, Deserialize)]
pub enum StorageType{
    #[serde(rename = "inCanister")]
    InCanister(ChunkNum),
    #[serde(rename = "simpleDistMap")]
    SimpleDistMap(ChunkNum, Option<Principal>),
    #[serde(rename = "ipfs")]
    IPFS(IPFSData),
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


pub async fn test_backend() -> bool{
    let transport = ic_agent::agent::http_transport::ReqwestHttpReplicaV2Transport::create("http://127.0.0.1:8000").expect("Could not create transport object");

    let agent = Agent::builder()
        .with_transport(transport)
        .build()
        .expect("Could not build agent");

    let princ = util::get_canister_principal_by_name("backend".to_string());


    agent.fetch_root_key().await.unwrap();

    if !test_create_video(agent, princ).await{
        return false;
    }


    println!("All backend tests successful ✅");

    return true;
}

async fn test_create_video(agent: Agent, princ: Principal) -> bool{

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

    let waiter = garcon::Delay::builder()
        .throttle(std::time::Duration::from_millis(500))
        .timeout(std::time::Duration::from_secs(30))
        .build();

    let response = agent.update(&princ, "createVideo")
        .with_arg(&Encode!(&video_info).expect("Could not encode"))
        .call_and_wait(waiter)
        .await;


    let result = match response {
        Ok(result) => Decode!(result.as_slice(), VideoInfo).expect("Could not deduce video info from result"),
        Err(err) => {
            println!("Api Call error: {:?}", err);
            return false;
        },
    };


    println!("Video: {:?}", result.video_id.clone().unwrap());

    return result.video_id.is_some();
}
