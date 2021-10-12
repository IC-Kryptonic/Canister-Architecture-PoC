#[cfg(test)]
mod ad_manager_tests {
    use crate::util;
    use crate::util::Actor;
    use ic_agent::export::Principal;
    use ic_cdk::export::candid::{Encode, Decode};
    use video_types::{VideoInfo, StorageType, Profile, AdMeta};

    use video_types::StorageType::Canister;
    use ic_agent::Identity;

    fn create_test_ad() -> VideoInfo{
        return VideoInfo{
            owner: Principal::from_slice(&[]),
            creator: Principal::from_slice(&[]),
            name: String::from("test_ad"),
            description: "".to_string(),
            keywords: vec![],
            thumbnail: vec![],
            storage_type: Canister(1, None),
            views: 0,
            likes: 0
        }
    }

    #[tokio::test]
    async fn test_add_ad() -> Result<(), String>{

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let ad_actor = Actor::from_name("ad_manager", identity).await;
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let video_actor = Actor::from_name("video_backend", identity).await;

        //create ad
        let test_ad_info = create_test_ad();
        let arg = Encode!(&test_ad_info, &false).expect("Could not encode test_ad info");
        let create_response = video_actor.update_call("create_video", arg).await;
        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");
        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let ad_data = AdMeta{
            principal: result_princ,
            allowance: 10,
            amount_per_view: 1,
            advertiser: identity.sender().expect("Could not get principal from identity"),
        };
        

        //Act
        let ad_arg = Encode!(&ad_data).expect("Could not encode ad principal");
        let response = ad_actor.update_call("add_ad", ad_arg).await;

        //Test
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty add_ad result");

        Ok(())
    }

    #[tokio::test]
    async fn test_get_random_ad() -> Result<(), String>{

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let ad_actor = Actor::from_name("ad_manager", identity).await;
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let video_actor = Actor::from_name("video_backend", identity).await;

        //create ad
        let test_ad_info = create_test_ad();
        let arg = Encode!(&test_ad_info, &false).expect("Could not encode test_ad info");
        let create_response = video_actor.update_call("create_video", arg).await;
        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");
        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let ad_data = AdMeta{
            principal: result_princ,
            allowance: 10,
            amount_per_view: 1,
            advertiser: identity.sender().expect("Could not get principal from identity"),
        };

        //add ad to ad manager
        let ad_arg = Encode!(&ad_data).expect("Could not encode ad principal");
        let response = ad_actor.update_call("add_ad", ad_arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty add_ad result");

        //Act
        let random_ad_arg = Encode!(&()).expect("Could not encode empty random ad arg");
        let response = ad_actor.query_call("get_random_ad_principal", random_ad_arg).await;

        //Test
        let raw_result = util::check_ok(response);
        let opt_princ = Decode!(raw_result.as_slice(), Option<Principal>).expect("Could not decode optional ad principal");

        assert!(opt_princ.is_some());

        Ok(())
    }

    #[tokio::test]
    async fn test_get_user_ad() -> Result<(), String>{

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let ad_actor = Actor::from_name("ad_manager", identity).await;

        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let video_actor = Actor::from_name("video_backend", identity).await;

        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let profile_actor = Actor::from_name("profile_backend", identity).await;

        //create ad
        let test_user_and_ad_name = format!("user and ad share the same name {}", my_principal);

        let mut test_ad_info = create_test_ad();
        test_ad_info.name = test_user_and_ad_name.clone();

        let arg = Encode!(&test_ad_info, &false).expect("Could not encode test_ad info");
        let create_response = video_actor.update_call("create_video", arg).await;
        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");
        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let ad_data = AdMeta{
            principal: result_princ,
            allowance: 10,
            amount_per_view: 1,
            advertiser: identity.sender().expect("Could not get principal from identity"),
        };

        //add ad to ad manager
        let ad_arg = Encode!(&ad_data).expect("Could not encode ad principal");
        let response = ad_actor.update_call("add_ad", ad_arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty add_ad result");

        //create profile
        let test_profile = Profile{
            principal: my_principal,
            name: test_user_and_ad_name,
            likes: Default::default(),
            comments: Default::default(),
            viewed: Default::default()
        };
        let create_profile_args = Encode!(&test_profile).expect("Could not encode test_profile");
        let profile_response = profile_actor.update_call("put_profile", create_profile_args).await;
        let raw_res = util::check_ok(profile_response);
        Decode!(raw_res.as_slice(), ()).expect("Could not decode empty put profile response");

        //Act
        let ad_arg = Encode!(&my_principal).expect("Could not encode my principal for get ad arg");
        let response = ad_actor.query_call("get_ad_principal_for_user", ad_arg).await;

        //Test
        let raw_result = util::check_ok(response);
        let opt_princ = Decode!(raw_result.as_slice(), Option<Principal>).expect("Could not decode optional ad principal");

        assert!(opt_princ.is_some());
        assert_eq!(opt_princ.unwrap(), result_princ);

        Ok(())
    }
}