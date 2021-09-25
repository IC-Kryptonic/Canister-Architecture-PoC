#[cfg(test)]
mod profile_backend_tests {
    use crate::util;
    use crate::util::{Actor, generate_random_identity};
    use ic_agent::export::Principal;
    use ic_cdk::export::candid::{Encode, Decode};
    use video_types::{Profile};
    use ic_agent::Identity;
    use std::collections::HashSet;

    #[tokio::test]
    async fn test_create_profile() -> Result<(), String>{

        //Setup
        let identity = util::generate_random_identity();
        let my_principal = identity.sender().expect("Could not deduce principal from random identity");
        let profile_actor = Actor::from_name("profile_backend", identity).await;


        let test_profile = create_test_profile(my_principal);
        let arg = Encode!(&test_profile, &false).expect("Could not encode profile");

        //Act
        let create_response = profile_actor.update_call("put_profile", arg).await;


        //Test
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty result");

        Ok(())
    }

    #[tokio::test]
    async fn test_create_and_get_profile() -> Result<(), String>{

        //Setup
        let identity = util::generate_random_identity();
        let my_principal = identity.sender().expect("Could not deduce principal from random identity");
        let profile_actor = Actor::from_name("profile_backend", identity).await;


        let test_profile = create_test_profile(my_principal.clone());

        let arg = Encode!(&test_profile, &false).expect("Could not encode profile");
        let create_response = profile_actor.update_call("put_profile", arg).await;
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty result");

        //Act
        let arg = Encode!(&my_principal).expect("Could not encode my principal");
        let get_response = profile_actor.query_call("get_profile", arg).await;

        //Test
        let raw_result = util::check_ok(get_response);
        let result = Decode!(raw_result.as_slice(), Option<Profile>).expect("Could not decode Optional Profile from get response");

        assert!(result.is_some());

        let profile = result.unwrap();

        assert_eq!(profile.name, test_profile.name);
        assert_eq!(profile.principal, my_principal);
        assert_eq!(profile.likes.len(), 0);
        assert_eq!(profile.comments.len(), 0);
        assert_eq!(profile.viewed.len(), 0);

        Ok(())
    }

    #[tokio::test]
    async fn test_like() -> Result<(), String>{

        //Setup
        let identity = util::generate_random_identity();
        let my_principal = identity.sender().expect("Could not deduce principal from random identity");
        let profile_actor = Actor::from_name("profile_backend", identity).await;


        let test_profile = create_test_profile(my_principal.clone());

        let arg = Encode!(&test_profile, &false).expect("Could not encode profile");
        let create_response = profile_actor.update_call("put_profile", arg).await;
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty result");

        //Act
        let arg = Encode!(&generate_random_identity().sender().expect("Could not deduce princ from random identity")).expect("Could not encode random princ");
        let response = profile_actor.update_call("add_like", arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode raw result to empty response");

        //Test
        let arg = Encode!(&my_principal).expect("Could not encode my principal");
        let get_response = profile_actor.query_call("get_profile", arg).await;
        let raw_result = util::check_ok(get_response);
        let result = Decode!(raw_result.as_slice(), Option<Profile>).expect("Could not decode Optional Profile from get response");

        let profile = result.expect("Created profile not in profile backend");
        assert_eq!(profile.likes.len(), 1);

        Ok(())
    }

    #[tokio::test]
    async fn test_comment() -> Result<(), String>{

        //Setup
        let identity = util::generate_random_identity();
        let my_principal = identity.sender().expect("Could not deduce principal from random identity");
        let profile_actor = Actor::from_name("profile_backend", identity).await;


        let test_profile = create_test_profile(my_principal.clone());

        let arg = Encode!(&test_profile, &false).expect("Could not encode profile");
        let create_response = profile_actor.update_call("put_profile", arg).await;
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty result");

        //Act
        let arg = Encode!(&generate_random_identity().sender().expect("Could not deduce princ from random identity")).expect("Could not encode random princ");
        let response = profile_actor.update_call("add_comment", arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode raw result to empty response");

        //Test
        let arg = Encode!(&my_principal).expect("Could not encode my principal");
        let get_response = profile_actor.query_call("get_profile", arg).await;
        let raw_result = util::check_ok(get_response);
        let result = Decode!(raw_result.as_slice(), Option<Profile>).expect("Could not decode Optional Profile from get response");

        let profile = result.expect("Created profile not in profile backend");
        assert_eq!(profile.comments.len(), 1);

        Ok(())
    }

    #[tokio::test]
    async fn test_view() -> Result<(), String>{

        //Setup
        let identity = util::generate_random_identity();
        let my_principal = identity.sender().expect("Could not deduce principal from random identity");
        let profile_actor = Actor::from_name("profile_backend", identity).await;


        let test_profile = create_test_profile(my_principal.clone());

        let arg = Encode!(&test_profile, &false).expect("Could not encode profile");
        let create_response = profile_actor.update_call("put_profile", arg).await;
        let raw_result = util::check_ok(create_response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode empty result");

        //Act
        let arg = Encode!(&generate_random_identity().sender().expect("Could not deduce princ from random identity")).expect("Could not encode random princ");
        let response = profile_actor.update_call("add_view", arg).await;
        let raw_result = util::check_ok(response);
        Decode!(raw_result.as_slice(), ()).expect("Could not decode raw result to empty response");

        //Test
        let arg = Encode!(&my_principal).expect("Could not encode my principal");
        let get_response = profile_actor.query_call("get_profile", arg).await;
        let raw_result = util::check_ok(get_response);
        let result = Decode!(raw_result.as_slice(), Option<Profile>).expect("Could not decode Optional Profile from get response");

        let profile = result.expect("Created profile not in profile backend");
        assert_eq!(profile.viewed.len(), 1);

        Ok(())
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