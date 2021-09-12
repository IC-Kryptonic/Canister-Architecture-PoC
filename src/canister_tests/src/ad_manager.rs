#[cfg(test)]
mod ad_manager_tests {
    use crate::util;
    use crate::util::Actor;
    use ic_agent::export::Principal;
    use ic_cdk::export::candid::{Encode, Decode, CandidType, Deserialize};
    use ic_agent::Identity;

    pub type ChunkNum = usize;

    #[derive(CandidType, Deserialize)]
    pub struct AdInfo{
        owner: Principal,
        canister: Option<Principal>,
        name: String,
        chunk_num: ChunkNum,
    }

    fn create_test_ad() -> AdInfo{
        return AdInfo{
            owner: Principal::anonymous(),
            canister: None,
            name: String::from("test_ad"),
            chunk_num: 1,
        }
    }

    #[tokio::test]
    async fn test_create_ad() -> Result<(), String>{
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let actor = Actor::from_name("ad_manager", identity).await;

        let test_ad_info = create_test_ad();

        let arg = Encode!(&test_ad_info).expect("Could not encode test_ad info");

        let response = actor.update_call("createAd", arg).await;

        let raw_result = util::check_ok(response);

        let result_ad = Decode!(raw_result.as_slice(), AdInfo).expect("Could not decode result ad");

        assert_eq!(result_ad.chunk_num, test_ad_info.chunk_num);
        assert!(result_ad.canister.is_some());
        assert_eq!(result_ad.owner, util::generate_pkcs8_identity(&util::PEKCS8_BYTES).sender().expect("Could net get sender from identity"));
        assert_eq!(result_ad.name, test_ad_info.name);

        Ok(())
    }
}