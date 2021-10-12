use ic_cdk::export::candid::{Principal};
use ic_cdk_macros::{update, query};
use ic_cdk::storage;
use ic_cdk::api::call;

use video_types::{AccountIdentifier, AdMeta, AllBalancesResponse, Balance, BalanceForAddress, Profile, SupplyResponse, TokenOwners, TransferRequest, TransferResponse, User, VideoInfo};
use std::collections::{HashMap};
use ic_cdk::api::call::RejectionCode;

pub type AdStore = HashMap<Principal, (AdMeta, VideoInfo)>;
pub type RevenueHistory = HashMap<Principal, HashMap<Principal, usize>>;

const PROFILE_PRINCIPAL: &str = env!("CANISTER_ID_profile_backend");
const NATIVE_TOKEN_PRINCIPAL: &'static str = env!("NATIVE_TOKEN_CANISTER_ID");

#[update]
pub async fn add_ad(ad_meta: AdMeta){
    let video_info = get_video_info(ad_meta.principal.clone()).await;

    assert_eq!(ad_meta.advertiser, ic_cdk::caller());

    storage::get_mut::<AdStore>().insert(ad_meta.principal.clone(), (ad_meta, video_info));
}

#[update]
pub async fn watched_ad(ad_principal: Principal, earning_video: Principal){
    let video_info = get_video_info(earning_video).await;
    let ad_data = storage::get_mut::<AdStore>().get_mut(&ad_principal).expect("Principal not a stored ad");

    if ad_data.0.amount_per_view < ad_data.0.allowance{
        ic_cdk::trap("Allowance lower than amount to be paid per view")
    }

    let to_distribute = ad_data.0.amount_per_view;
    ad_data.0.allowance -= to_distribute;

    //TODO check if owner is token, else just pay to owner
    let token_supply = get_token_supply(video_info.owner).await;
    let owners= get_token_owners(video_info.owner).await;

    let amount_per_share = to_distribute / token_supply;
    //TODO pay out to_distribute%token_supply to us

    for owner in owners{
        pay_out_ad_rev(ad_data.0.advertiser, owner.address, amount_per_share*owner.balance);
    }
}



//TODO, only get ads with balance
#[query]
pub async fn get_random_ad_principal() -> Option<Principal>{
    let ads = storage::get::<AdStore>();

    return if ads.is_empty(){
        None
    } else {
        let i = ic_cdk::api::time() as usize % ads.len();   //rand crate not supported even with js enabled for wasm, so we use time to generate random values

        for (j, ad) in ads.keys().enumerate(){
            if i == j{
                return Some(ad.clone());    //TODO find something more efficient, this is horrible
            }
        }
        panic!("This should not happen");
    }
}

//TODO, only get ads with balance
#[query]
pub async fn get_ad_principal_for_user(user: Principal) -> Option<Principal>{
    return if let Some(profile) = get_profile(user).await {
        let ads = storage::get::<AdStore>();

        for (princ, info) in ads {
            if profile.name == info.name {   //TODO make something less dumb
                return Some(princ.clone());
            }
        }
        get_random_ad_principal().await
    } else {
        ic_cdk::api::print("No user profile found defaulting to random ad");
        get_random_ad_principal().await
    }
}

async fn get_token_supply(token_canister: Principal) -> Balance {

    let response: Result<(SupplyResponse,), _> = call::call(token_canister, "supply", ("",)).await;

    match response{
        Ok((supply_response)) => {
            match supply_response{
                Ok(balance) => return balance,
                Err(_) => ic_cdk::trap("Supply call returned err"),
            }
        }
        Err(_) => {
            ic_cdk::api::trap(format!("Error querying supply for for token {}. {:?}, message: {}", token_canister, rej_code, msg).as_str());
        }
    }
}

async fn get_token_owners(token_canister: Principal) -> Vec<BalanceForAddress> {

    let response: Result<(AllBalancesResponse,), _> = call::call(token_canister, "allBalances", ()).await;

    match response{
        Ok((balances_response)) => {
            match balances_response{
                Ok(balances) => return balances,
                Err(_) => ic_cdk::trap("AllBalances call returned err"),
            }
        }
        Err(_) => {
            ic_cdk::api::trap(format!("Error querying all balances for for token {}. {:?}, message: {}", token_canister, rej_code, msg).as_str());
        }
    }
}


async fn pay_out_ad_rev(advertiser: Principal, receiver: AccountIdentifier, amount: Balance){
    let native_token_canister = Principal::from_text(NATIVE_TOKEN_PRINCIPAL.clone()).expect("Couldn't deduce Principal from native token canister id text");

    let transfer_request = TransferRequest{
        from: User::Principal(ad_owner),
        to: User::Address(receiver),
        token: "".to_string(),
        amount,
        memo: vec![],
        notify: false,
        subaccount: None
    };

    let response: Result<(TransferResponse,), _> = call::call(native_token_canister, "transfer", (transfer_request,)).await;

    match response{
        Ok((transfer_response,)) => {
            match transfer_response{
                Ok(_) => return,
                Err(_) => ic_cdk::api::trap(format!("Something went wrong transferring {} from {} to {}", amount, ad_owner, receiver).to_str()),
            }
        }
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error transfering ad revenue with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}

async fn get_profile(princ: Principal) -> Option<Profile>{
    let profile_canister = Principal::from_text(PROFILE_PRINCIPAL.clone()).expect("Couldn't deduce Principal from profile canister id text");

    let response: Result<(Option<Profile>,), _> = call::call( profile_canister, "get_profile", (princ,)).await;

    match response{
        Ok((profile_res,)) => return profile_res,
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error getting profile with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}

async fn get_video_info(video_princ: Principal) -> VideoInfo{

    let response: Result<(VideoInfo,), _> = call::call( video_princ, "get_info", ()).await;

    match response{
        Ok((video_res,)) => return video_res,
        Err((rej_code, msg)) => {
            ic_cdk::api::trap(format!("Error getting video info with code {:?}, message: {}", rej_code, msg).as_str());
        }
    }
}