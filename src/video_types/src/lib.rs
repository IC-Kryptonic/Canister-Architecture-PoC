use ic_cdk::export::candid::{{CandidType, Deserialize}, Principal};
use std::collections::HashSet;

pub type ChunkNum = usize;
pub type Chunk = Vec<u8>;
pub type Chunks = Vec<Chunk>;
pub type Feed = Vec<Principal>;

#[derive(Clone, CandidType, Deserialize)]
pub struct IPFSData{
    data: String,
}

#[derive(Clone, CandidType, Deserialize)]
pub enum StorageType{
    #[serde(rename = "canister")]
    SimpleDistMap(ChunkNum, Option<Principal>),
    #[serde(rename = "ipfs")]
    IPFS(IPFSData),
}

#[derive(Clone, CandidType, Deserialize)]
pub struct VideoInfo{
    pub owner: Principal,
    pub creator: Principal,
    pub name: String,
    pub description: String,
    pub keywords: Vec<String>,
    pub thumbnail: Vec<u8>,
    pub storage_type: StorageType,
    pub view: usize,
    pub likes: usize,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Profile{
    pub principal: Principal,
    pub name: String,
    pub likes: HashSet<Principal>
}

