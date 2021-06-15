use backend;
use ic_types::Principal;
use backend::video::VideoId;

mod common;

#[test]
fn test_create_video(){
    common::setup();
    let id = common::create_test_video_info(); 
    assert_ne!(id, "");
}

#[test]
fn test_create_videos(){
    common::setup();
    for _ in 0..3{
        let _id = common::create_test_video_info();
    }
    assert!(true);
}

#[test]
fn test_get_video_info(){
    common::setup();
    let id = common::create_test_video_info();
    let video_res = backend::video::get_video_info(id).unwrap();

    assert_eq!(common::TEST_VIDEO_NAME, video_res.name);
    assert_eq!(common::TEST_VIDEO_DESCRIPTION, video_res.description);
    assert_eq!(common::TEST_VIDEO_KEYWORDS, video_res.keywords);
    assert_eq!(common::TEST_VIDEO_CHUNK_COUNT, video_res.chunk_count);
}

#[test]
fn test_put_and_get_chunk(){
    common::setup();
    let id = common::create_test_video_info_with_chunks(1);

    let chunk = vec![0x74, 0x65, 0x73, 0x74];
    backend::video::put_chunk(chunk.clone(), 0, id.clone());

    let chunk_res = backend::video::get_chunk(0, id).unwrap();

    assert_eq!(chunk, *chunk_res);
}

#[test]
fn test_put_and_get_multiple_chunks(){

    let mut chunks = Vec::new();
    for i in 0u8..10u8{
        chunks.push(vec![i, i+1]);
    }

    common::setup();
    let id = common::create_test_video_info_with_chunks(chunks.len());

    for (i, chunk) in chunks.iter().enumerate(){
        backend::video::put_chunk(chunk.clone(), i, id.clone());
    }

    for (i, chunk) in chunks.drain(..).enumerate(){
        let chunk_res = backend::video::get_chunk(i, id.clone()).unwrap();

        assert_eq!(chunk, *chunk_res);
    }
}

#[test]
fn test_default_feed_length(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let _id2 = common::create_test_video_info();
    let feed_res = backend::video::get_default_feed(1);

    assert_eq!(feed_res.len(), 1);
}


#[test]
fn test_default_feed_full(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let _id2 = common::create_test_video_info();
    let feed_res = backend::video::get_default_feed(10);

    assert_eq!(feed_res.len(), 2);
}

#[test]
fn test_keyword_search() {
    common::setup();
    let _id1 = common::create_test_video_info();
    let keyword = String::from(common::TEST_VIDEO_KEYWORDS[0]);
    let res = backend::video::search_video(keyword.clone());

    assert!(res.is_some());
    assert!(res.unwrap().keywords.contains(&keyword));
}

#[test]
fn test_name_search(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let name = String::from(common::TEST_VIDEO_NAME);
    let res = backend::video::search_video(name.clone());

    assert!(res.is_some());
    assert_eq!(res.unwrap().name, name);
}

#[test]
fn test_description_search(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let description = String::from(common::TEST_VIDEO_DESCRIPTION);
    let res = backend::video::search_video(description.clone());

    assert!(res.is_some());
    assert_eq!(res.unwrap().description, description);
}

#[test]
fn test_reset(){
    common::setup();
    
    for _ in 0..10{
        common::create_test_video_info();
    }

    backend::reset();
    let feed = backend::video::get_default_feed(10);

    assert!(feed.is_empty());
}

#[test]
fn test_get_profile(){
    common::setup();
    common::create_test_profile();

    let profile = backend::profile::get_profile(Principal::from_slice(&[])).unwrap();

    assert_eq!(common::TEST_PROFILE_NAME, profile.name);
    assert_eq!(common::TEST_PROFILE_LIKES.iter().collect::<Vec<&&str>>().sort(), profile.likes.iter().collect::<Vec<&VideoId>>().sort());
}

#[test]
fn test_get_current_profile(){
    common::setup();
    common::create_test_profile();

    let profile = backend::profile::get_current_profile().unwrap();

    assert_eq!(common::TEST_PROFILE_NAME, profile.name);
    assert_eq!(common::TEST_PROFILE_LIKES.iter().collect::<Vec<&&str>>().sort(), profile.likes.iter().collect::<Vec<&VideoId>>().sort());
}


#[test]
fn test_create_profile(){
    common::setup();

    let name = "I am a test name";
    let new_profile = backend::profile::Profile{
        principal: Principal::from_slice(&[]),
        name: String::from(name),
        likes: ["id1", "id2", "id3"].iter().map(|&w| VideoId::from(w)).collect(),
    };
    backend::profile::create_profile(new_profile.clone());

    let profile = backend::profile::get_profile(Principal::from_slice(&[])).unwrap();

    assert_eq!(new_profile.name, profile.name);
    assert_eq!(new_profile.likes, profile.likes);
}

#[test]
fn test_like_video(){
    common::setup();
    common::create_test_profile();

    let liked_video = VideoId::from("cool_video");
    backend::profile::like_video(liked_video.clone());

    let profile = backend::profile::get_current_profile().unwrap();

    assert!(profile.likes.contains(&liked_video));
}