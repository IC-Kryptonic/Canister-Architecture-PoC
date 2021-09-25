#[cfg(test)]
mod video_canister_tests {
    use ic_agent::export::Principal;
    use ic_agent::{AgentError, Identity};
    use ic_cdk::export::candid::{Decode, Encode};

    use crate::util::Actor;
    use crate::util;

    use video_types::{StorageType, VideoInfo, Chunk, Comment};

    #[tokio::test]
    async fn test_create_video() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        //Act
        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        //Test
        let raw_result = util::check_ok(create_response);

        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        assert_eq!(test_video_info.name, result.name);
        assert_eq!(test_video_info.description, result.description);
        assert_eq!(test_video_info.keywords, result.keywords);
        assert_eq!(test_video_info.thumbnail, result.thumbnail);
        matches!(result.storage_type, StorageType::Canister(1, _result_princ));
        assert_eq!(my_principal, result.creator);

        return Ok(());
    }

    #[tokio::test]
    async fn test_create_and_get_video_info() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let get_arg = Encode!(&()).expect("Could not encode empty arg");

        let get_response = video_actor.query_call("get_info", get_arg).await;

        //Test
        let raw_get_result = util::check_ok(get_response);

        let get_result = Decode!(raw_get_result.as_slice(), VideoInfo).expect("Could not deduce video info from result");

        assert_eq!(test_video_info.name, get_result.name);
        assert_eq!(test_video_info.description, get_result.description);
        assert_eq!(test_video_info.keywords, get_result.keywords);
        assert_eq!(test_video_info.thumbnail, get_result.thumbnail);
        matches!(get_result.storage_type, StorageType::Canister(1, _result_princ));
        assert_eq!(my_principal, get_result.creator);
        assert_eq!(my_principal, get_result.owner); //should be owner since not set via token manager
        assert_eq!(0, get_result.likes);
        assert_eq!(0, get_result.views);

        Ok(())
    }


    #[tokio::test]
    async fn test_store_video() -> Result<(), String> {

        //Setup
        let identity = util::generate_random_identity();
        let _my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let video_data: Chunk = vec![0xCA, 0xFF, 0xEE];

        let store_args = Encode!(&0usize, &video_data).expect("store args could not be encoded");

        let store_response = video_actor.update_call("insert_chunk", store_args).await;

        //Test
        let raw_result = util::check_ok(store_response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode store result correctly");

        Ok(())
    }


    #[tokio::test]
    async fn test_store_and_load_video() -> Result<(), String> {

        //Setup
        let identity = util::generate_random_identity();
        let _my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let video_data: Chunk = vec![0xCA, 0xFF, 0xEE];

        let store_args = Encode!(&0usize, &video_data).expect("store args could not be encoded");

        let store_response = video_actor.update_call("insert_chunk", store_args).await;

        let raw_result = util::check_ok(store_response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode store result correctly");


        //Act
        let load_args = Encode!(&0usize).expect("Could not encode load args");

        let load_response = video_actor.query_call("get_chunk", load_args).await;

        let raw_result = util::check_ok(load_response);
        let result = Decode!(raw_result.as_slice(), Option<Chunk>).expect("Could not decode load result correctly");

        //Test
        let result_video_data = result.expect("Video data is not in canister");
        assert_eq!(result_video_data, video_data);

        Ok(())
    }

    #[tokio::test]
    async fn test_nonsense_video_creation() -> Result<(), String> {
        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let actor = Actor::from_name("video_backend", identity).await;

        let nonsense_test_video_info = [0xCA, 0xFF, 0xEE];

        let create_args = Encode!(&nonsense_test_video_info).expect("Could not encode video_info");

        //Act
        let create_response = actor.update_call("create_video", create_args).await;

        //Test
        let error = util::check_err(create_response);

        if matches!(error, AgentError::ReplicaError{
        reject_code: 5,
        reject_message: _,
    }) {
            Ok(())
        } else {
            Err(format!("{:?}", error))
        }
    }

    #[tokio::test]
    async fn test_create_and_like() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let _my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let arg = Encode!(&()).expect("Could not encode empty arg");

        let like_response = video_actor.update_call("add_like", arg).await;

        let raw_like_result = util::check_ok(like_response);

        Decode!(raw_like_result.as_slice(), ()).expect("Could not decode should be empty like result");

        //Test
        let get_arg = Encode!(&()).expect("Could not encode empty arg");

        let get_response = video_actor.query_call("get_info", get_arg).await;

        let raw_get_result = util::check_ok(get_response);

        let get_result = Decode!(raw_get_result.as_slice(), VideoInfo).expect("Could not deduce video info from result");

        assert_eq!(1, get_result.likes);

        Ok(())
    }


    #[tokio::test]
    async fn test_create_and_double_like() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let _my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let arg = Encode!(&()).expect("Could not encode empty arg");

        let like_response = video_actor.update_call("add_like", arg.clone()).await;
        let raw_like_result = util::check_ok(like_response);
        Decode!(raw_like_result.as_slice(), ()).expect("Could not decode should be empty like result");

        let like_response = video_actor.update_call("add_like", arg).await;
        let raw_like_result = util::check_ok(like_response);
        Decode!(raw_like_result.as_slice(), ()).expect("Could not decode should be empty like result");

        //Test
        let get_arg = Encode!(&()).expect("Could not encode empty arg");

        let get_response = video_actor.query_call("get_info", get_arg).await;

        let raw_get_result = util::check_ok(get_response);

        let get_result = Decode!(raw_get_result.as_slice(), VideoInfo).expect("Could not deduce video info from result");

        assert_eq!(1, get_result.likes);

        Ok(())
    }

    #[tokio::test]
    async fn test_create_and_add_valid_comment() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let _my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let arg = Encode!(&String::from("This is a comment")).expect("Could not encode empty arg");

        let response = video_actor.update_call("add_comment", arg).await;


        //Test
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode should be empty response");

        Ok(())
    }

    #[tokio::test]
    async fn test_create_and_add_invalid_comment() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let _my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let arg = Encode!(&String::from("This is a very very long comment, much longer than 140 characters. Therefore the video canister should reject it and return an error code. Is this comment long enough yet? I hope so!")).expect("Could not encode empty arg");

        let response = video_actor.update_call("add_comment", arg).await;

        //Test
        let err = util::check_err(response);

        if matches!(err, AgentError::ReplicaError{
            reject_code: 5,
            reject_message: _,
        }){
            Ok(())
        } else {
            Err(format!("{:?}", err))
        }
    }

    #[tokio::test]
    async fn test_add_valid_comment_and_retrieve() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let comment = String::from("This is a comment");

        let arg = Encode!(&comment).expect("Could not encode empty arg");
        let response = video_actor.update_call("add_comment", arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode should be empty response");

        let arg = Encode!(&my_principal).expect("Could not encode my_principal");
        let response = video_actor.query_call("get_comment", arg).await;


        //Test
        let raw_result = util::check_ok(response);
        let comment_res = Decode!(raw_result.as_slice(), Option<String>).expect("Could not decode Option<String> from get_comment").expect("Comment not found in canister");

        assert_eq!(comment, comment_res);

        Ok(())
    }

    #[tokio::test]
    async fn test_add_valid_comment_and_retrieve_multiple() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        let result = Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let result_princ = match result.storage_type{
            StorageType::Canister(_, princ) => princ.expect("Video id not in result"),
            _ => return Err(String::from("Returned storage type not same as send storage type")),
        };

        //Act
        let video_actor = Actor{
            agent: actor.agent,
            principal: result_princ,
        };

        let comment = String::from("This is a comment");

        let arg = Encode!(&comment).expect("Could not encode empty arg");
        let response = video_actor.update_call("add_comment", arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode should be empty response");

        let arg = Encode!(&5usize).expect("Could not encode number");
        let response = video_actor.query_call("get_comments", arg).await;


        //Test
        let raw_result = util::check_ok(response);
        let comment_res = Decode!(raw_result.as_slice(), Vec<Comment>).expect("Could not decode Option<String> from get_comment");

        assert_eq!(comment_res.len(), 1);
        assert_eq!(comment_res[0], (my_principal, comment));

        Ok(())
    }

    fn create_test_video(storage_type: StorageType) -> VideoInfo {
        VideoInfo {
            owner: Principal::from_slice(&[]),
            creator: Principal::from_slice(&[]),
            name: String::from("testing_name"),
            description: String::from("testing_desc"),
            keywords: vec!["testing_keyword1".to_string(), "testing_keyword2".to_string()],
            thumbnail: vec![],
            storage_type,
            views: 0,
            likes: 0
        }
    }
}