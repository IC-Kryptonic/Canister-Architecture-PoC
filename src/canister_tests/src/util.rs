use std::process::Command;
use ic_agent::export::Principal;
use ic_agent::{Agent, AgentError, Identity};
use ic_agent::identity::BasicIdentity;

use ring::{
    rand,
    signature::Ed25519KeyPair,
};

pub const PEKCS8_BYTES: [u8; 85] = [48, 83, 2, 1, 1, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32, 191, 133, 145, 54, 228, 183, 112, 79, 70, 178, 129, 153, 221, 135, 191, 151, 140, 28, 79, 129, 8, 121, 196, 103, 206, 171, 198, 115, 12, 227, 83, 115, 161, 35, 3, 33, 0, 209, 138, 9, 205, 215, 209, 20, 65, 189, 217, 76, 125, 206, 173, 161, 240, 103, 100, 153, 82, 222, 213, 24, 58, 22, 65, 36, 190, 209, 191, 173, 122];

pub struct Actor {
    pub agent: Agent,
    pub principal: Principal,
}

impl Actor{
    pub async fn from_name(name: &str, agent_identity: BasicIdentity) -> Actor{
        let agent = build_agent(agent_identity).await;

        let principal = get_canister_principal_by_name(name);
        Actor{
            agent,
            principal,
        }
    }

    pub async fn update_call(&self, method_name: &str, arg: Vec<u8>) -> Result<Vec<u8>, AgentError> {

        self.agent.update(&self.principal, method_name)
            .with_arg(arg)
            .call_and_wait(default_waiter()).await
    }

    pub async fn query_call(&self, method_name: &str, arg: Vec<u8>) -> Result<Vec<u8>, AgentError> {

        self.agent.query(&self.principal, method_name)
            .with_arg(arg)
            .call().await
    }
}

pub fn check_ok(res: Result<Vec<u8>, AgentError>) -> Vec<u8>{
    match res{
        Ok(vec) => {
            vec
        },
        Err(err) => {
            panic!("Canister call was not successful {:?}", err)
        },
    }
}

pub fn check_err(res: Result<Vec<u8>, AgentError>) -> AgentError{
    match res{
        Ok(_vec) => {
            panic!("Canister call was successful")
        },
        Err(err) => {
            err
        },
    }
}

pub fn get_canister_principal_by_name(name: &str) -> Principal{
    let out = Command::new("dfx")
        .current_dir("../../")//tests happen in the directory src/"project"
        .arg("canister")
        .arg("id")
        .arg(name)
        .output()
        .expect("Error retrieving principal by name");

    let str = String::from_utf8(out.stdout).expect("Can't convert stdout to string");
    let str = str.trim();

    return Principal::from_text(str.clone()).expect(&*format!("Could not deduce principal from text {}", str))
}

pub async fn build_agent(identity: BasicIdentity) -> Agent{
    let transport = ic_agent::agent::http_transport::ReqwestHttpReplicaV2Transport::create("http://127.0.0.1:8000").expect("Could not create transport object");

    let agent = Agent::builder()
        .with_transport(transport)
        .with_identity(identity)
        .build()
        .expect("Could not build agent");

    agent.fetch_root_key().await.unwrap();

    return agent;
}

pub fn default_waiter() -> garcon::Delay{
    garcon::Delay::builder()
        .throttle(std::time::Duration::from_millis(500))
        .timeout(std::time::Duration::from_secs(30))
        .build()
}

pub fn generate_random_identity() -> BasicIdentity{
    let rng = rand::SystemRandom::new();
    let pkcs8_bytes = Ed25519KeyPair::generate_pkcs8(&rng).expect("Could not create pkcs8 bytes from rng");
    let key_pair = Ed25519KeyPair::from_pkcs8(pkcs8_bytes.as_ref()).expect("Could not derive key pair from pkcs8");
    BasicIdentity::from_key_pair(key_pair)
}

pub fn generate_pkcs8_identity(bytes: &[u8]) -> BasicIdentity{
    let key_pair = Ed25519KeyPair::from_pkcs8(bytes).expect("Could not derive key pair from pkcs8");
    BasicIdentity::from_key_pair(key_pair)
}