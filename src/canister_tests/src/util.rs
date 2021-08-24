use std::process::Command;
use ic_agent::export::Principal;
use ic_agent::{Agent, AgentError};

pub struct Actor {
    pub agent: Agent,
    pub(crate) principal: Principal,
}

impl Actor{
    pub async fn from_name(name: &str) -> Actor{
        let agent = build_agent().await;

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
        Err(_err) => {
            panic!("Canister call was not successful")
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

pub async fn build_agent() -> Agent{
    let transport = ic_agent::agent::http_transport::ReqwestHttpReplicaV2Transport::create("http://127.0.0.1:8000").expect("Could not create transport object");

    let agent = Agent::builder()
        .with_transport(transport)
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