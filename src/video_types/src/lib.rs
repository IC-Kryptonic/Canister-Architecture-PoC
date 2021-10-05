use ic_cdk::export::candid::{{CandidType, Deserialize}, Principal};
use serde::Serialize;
use std::collections::{HashSet};

pub type ChunkNum = usize;
pub type Chunk = Vec<u8>;
pub type Chunks = Vec<Chunk>;
pub type Feed = HashSet<&'static Principal>;
pub type TestFeed = HashSet<Principal>;
pub type Comment = (Principal, String);

pub const MAX_CHUNK_SIZE: usize = 1024 * 500; // 500kb

#[derive(Clone, CandidType, Deserialize)]
pub struct IPFSData{
    data: String,
}

#[derive(Clone, CandidType, Deserialize)]
pub enum StorageType{
    #[serde(rename = "canister")]
    Canister(ChunkNum, Option<Principal>),
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
    pub views: usize,
    pub likes: usize,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Profile{
    pub principal: Principal,
    pub name: String,
    pub likes: HashSet<Principal>,
    pub comments: HashSet<Principal>,
    pub viewed: HashSet<Principal>,
}

pub const MAX_COMMENT_LENGTH: usize = 140;

#[derive(CandidType, Deserialize)]
pub struct CreateCanisterResult {
    pub canister_id: Principal,
}

#[derive(CandidType, Deserialize)]
pub enum InstallMode {
    #[serde(rename = "install")]
    Install,
    #[serde(rename = "reinstall")]
    Reinstall,
    #[serde(rename = "upgrade")]
    Upgrade,
}

#[derive(CandidType, Deserialize)]
pub struct InstallCodeArg {
    pub mode: InstallMode,
    pub canister_id: Principal,
    pub wasm_module: Vec<u8>,
    pub arg : Vec<u8>,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct TokenMetadata{

    #[serde(rename = "storageCanisterId")]
    pub storage_canister_id: String,

    pub description: String,
    pub creator: String,
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct TokenAsRecord{

    #[serde(rename = "canisterId")]
    pub canister_id: String,

    pub metadata: String,
    pub name: String,

    #[serde(rename = "ownedAmount")]
    pub owned_amount: i128,

    pub supply: u128,
    pub symbol: String,
}

#[derive(CandidType, Deserialize, Serialize)]
pub enum DexResult{
    #[serde(rename = "err")]
    Err(ExchangeError),
    #[serde(rename = "ok")]
    Ok,
}

#[derive(CandidType, Deserialize, Serialize, Debug)]
pub enum ExchangeError{
    InsufficientAllowance(u128),
    InsufficientBalance(u128),
    InternalError(String),
    NoExistingOffersForm(Principal),
    NoMatchingOffers,
    TransferError,
}