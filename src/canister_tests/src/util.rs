use std::process::Command;
use ic_agent::export::Principal;

pub fn get_canister_principal_by_name(name: String) -> Principal{
    let out = Command::new("dfx")
        .arg("canister")
        .arg("id")
        .arg(name)
        .output()
        .expect("Error retrieving principal by name");

    let str = String::from_utf8(out.stdout).expect("Can't convert stdout to string");
    let str = str.trim();

    return Principal::from_text(str.clone()).expect(&*format!("Could not deduce principal from text {}", str))
}