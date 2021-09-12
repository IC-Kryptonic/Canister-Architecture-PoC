#[cfg(test)]
mod ad_manager_tests {
    use crate::util;
    use crate::util::Actor;
    use ic_agent::export::Principal;
    use ic_cdk::export::candid::{Encode, Decode, CandidType, Deserialize};
    use ic_agent::Identity;

    pub type ChunkNum = usize;
    pub type Chunk = Vec<u8>;

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

    #[tokio::test]
    async fn test_store_ad() -> Result<(), String>{
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let actor = Actor::from_name("ad_manager", identity).await;

        let test_ad_info = create_test_ad();

        let arg = Encode!(&test_ad_info).expect("Could not encode test_ad info");

        let response = actor.update_call("createAd", arg).await;

        let raw_result = util::check_ok(response);

        let result_ad = Decode!(raw_result.as_slice(), AdInfo).expect("Could not decode result ad");

        let ad_canister = result_ad.canister.expect("No canister principal in result ad");
        let ad_data: [u8; 3] = [0xCA, 0xFF, 0xEE];
        let chunk_num: u64 = 0;
        let data_arg = Encode!(&chunk_num, &ad_data).expect("Could not encode ad_data");

        let ad_actor = Actor{
            agent: actor.agent,
            principal: ad_canister,
        };

        let insert_response = ad_actor.update_call("insertChunk", data_arg).await;
        let raw_result = util::check_ok(insert_response);

        Decode!(raw_result.as_slice(), ()).expect("Could not decode insert response result");

        Ok(())
    }

    #[tokio::test]
    async fn test_retrieve_ad_info() -> Result<(), String>{
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let actor = Actor::from_name("ad_manager", identity).await;

        let test_ad_info = create_test_ad();

        let arg = Encode!(&test_ad_info).expect("Could not encode test_ad info");

        let response = actor.update_call("createAd", arg).await;

        let raw_result = util::check_ok(response);

        let result_ad = Decode!(raw_result.as_slice(), AdInfo).expect("Could not decode result ad");

        let ad_canister = result_ad.canister.expect("No canister principal in result ad");
        let empty_arg = Encode!().expect("Could not encode empty");

        let ad_actor = Actor{
            agent: actor.agent,
            principal: ad_canister,
        };

        let raw_result_info = ad_actor.query_call("getInfo", empty_arg).await;

        let raw_info = util::check_ok(raw_result_info);
        let result_info = Decode!(raw_info.as_slice(), AdInfo).expect("Could not deocde result_info");

        assert_eq!(result_info.chunk_num, result_ad.chunk_num);
        assert_eq!(result_info.name, result_ad.name);
        assert_eq!(result_info.owner, result_ad.owner);
        assert_eq!(result_info.canister.expect("no canister in result info"), ad_actor.principal);

        Ok(())
    }

    #[tokio::test]
    async fn test_retrieve_chunk() -> Result<(), String>{
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let actor = Actor::from_name("ad_manager", identity).await;

        let test_ad_info = create_test_ad();

        let arg = Encode!(&test_ad_info).expect("Could not encode test_ad info");

        let response = actor.update_call("createAd", arg).await;

        let raw_result = util::check_ok(response);

        let result_ad = Decode!(raw_result.as_slice(), AdInfo).expect("Could not decode result ad");

        let ad_canister = result_ad.canister.expect("No canister principal in result ad");
        let ad_data: [u8; 3] = [0xCA, 0xFF, 0xEE];
        let chunk_num: u64 = 0;
        let data_arg = Encode!(&chunk_num, &ad_data).expect("Could not encode ad_data");

        let ad_actor = Actor{
            agent: actor.agent,
            principal: ad_canister,
        };

        let res = ad_actor.update_call("insertChunk", data_arg).await;
        util::check_ok(res);


        let chunk_arg = Encode!(&0usize).expect("Could not encode 0usize, something is terribly off :)");
        let chunk_res_raw = ad_actor.query_call("getChunk", chunk_arg).await;
        let chunk_raw = util::check_ok(chunk_res_raw);
        let chunk_res = Decode!(&chunk_raw, Option<Chunk>).expect("Could not decode chunk");
        let chunk = chunk_res.expect("Chunk was not in canister or it returned None on accident");

        assert_eq!(ad_data, chunk.as_slice());

        Ok(())
    }
}