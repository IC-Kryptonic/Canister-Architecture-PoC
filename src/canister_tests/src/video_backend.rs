#[cfg(test)]
mod video_backend_tests {
    use ic_agent::export::Principal;
    use ic_agent::{Identity};
    use ic_cdk::export::candid::{Decode, Encode};

    use crate::util::Actor;
    use crate::util;

    use video_types::{StorageType, VideoInfo, Profile, TestFeed};
    use std::collections::HashSet;

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
    async fn test_creator_feed() -> Result<(), String> {

        //Setup
        let identity = util::generate_random_identity();
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        //Act

        let feed_args = Encode!(&1usize, &my_principal).expect("Could not encode feed args");
        let feed_response = actor.query_call("get_creator_feed", feed_args).await;
        let raw_feed = util::check_ok(feed_response);
        let feed = Decode!(raw_feed.as_slice(), TestFeed).expect("Could not decode Feed");

        //Test
        assert_eq!(feed.len(), 1);

        Ok(())
    }

    #[tokio::test]
    async fn test_search_feed() -> Result<(), String> {

        //Setup
        let identity = util::generate_random_identity();
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let searchable_name = format!("this_string_will_be_searched_and_is_unique:{}", my_principal);

        let mut test_video_info = create_test_video(StorageType::Canister(1, None));
        test_video_info.name = searchable_name.clone();

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args).await;

        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        //Act

        let feed_args = Encode!(&1usize, &searchable_name).expect("Could not encode feed args");
        let feed_response = actor.query_call("get_search_feed", feed_args).await;
        let raw_feed = util::check_ok(feed_response);
        let feed = Decode!(raw_feed.as_slice(), TestFeed).expect("Could not decode Feed");

        //Test
        assert_eq!(feed.len(), 1);

        Ok(())
    }

    #[tokio::test]
    async fn test_random_feed() -> Result<(), String> {

        //Setup
        let identity = util::generate_random_identity();
        let _my_principal = identity.sender().expect("Could not deduce principal from identity");
        let actor = Actor::from_name("video_backend", identity).await;

        let test_video_info = create_test_video(StorageType::Canister(1, None));

        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");

        let create_response = actor.update_call("create_video", create_args.clone()).await;
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        let create_response = actor.update_call("create_video", create_args).await;
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        //Act
        let feed_args = Encode!(&2usize).expect("Could not encode feed args");
        let feed_response = actor.query_call("get_random_feed", feed_args).await;
        let raw_feed = util::check_ok(feed_response);
        let feed = Decode!(raw_feed.as_slice(), TestFeed).expect("Could not decode Feed");

        //Test
        assert_eq!(feed.len(), 2);

        Ok(())
    }

    #[tokio::test]
    async fn test_user_feed() -> Result<(), String> {

        //Setup
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let my_principal = identity.sender().expect("Could not deduce principal from identity");
        let video_backend_actor = Actor::from_name("video_backend", identity).await;
        let identity = util::generate_pkcs8_identity(&util::PEKCS8_BYTES);
        let profile_backend_actor = Actor::from_name("profile_backend", identity).await;

        //create video
        let test_video_info = create_test_video(StorageType::Canister(1, None));
        let create_args = Encode!(&test_video_info, &true).expect("Could not encode video_info");
        let create_response = video_backend_actor.update_call("create_video", create_args).await;
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), VideoInfo).expect("Could not decode video info from result");

        //create profile
        let test_profile = create_test_profile(my_principal);
        let create_profile_args = Encode!(&test_profile).expect("Could not encode test_profile");
        let profile_response = profile_backend_actor.update_call("put_profile", create_profile_args).await;
        let raw_res = util::check_ok(profile_response);
        Decode!(raw_res.as_slice(), ()).expect("Could not decode empty put profile response");

        //retrieve feed 1. time
        let feed_args = Encode!(&100000usize, &my_principal).expect("Could not encode feed args");
        let feed_response = video_backend_actor.query_call("get_user_feed", feed_args).await;
        let raw_feed = util::check_ok(feed_response);
        let feed1 = Decode!(raw_feed.as_slice(), TestFeed).expect("Could not decode Feed");

        //view videos
        for video in &feed1{
            let viewed_args = Encode!(&video).expect("Could not encode result princ");
            let viewed_response = profile_backend_actor.update_call("add_view", viewed_args).await;
            let raw_result = util::check_ok(viewed_response);
            Decode!(raw_result.as_slice(), ()).expect("Could not decode () from viewed result");
        }

        //retrieve feed 2. time
        let feed_args = Encode!(&100000usize, &my_principal).expect("Could not encode feed args");
        let feed_response = video_backend_actor.query_call("get_user_feed", feed_args).await;
        let raw_feed = util::check_ok(feed_response);
        let feed2 = Decode!(raw_feed.as_slice(), TestFeed).expect("Could not decode Feed");

        assert_eq!(feed1, feed2);

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

    fn create_test_profile(principal: Principal) -> Profile{
        Profile{
            principal,
            name: String::from("test_profile_name"),
            likes: HashSet::new(),
            comments: HashSet::new(),
            viewed: HashSet::new()
        }
    }
}