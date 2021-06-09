use rust_video; 

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
    let video_res = rust_video::get_video_info(id).unwrap();

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
    rust_video::put_chunk(chunk.clone(), 0, id.clone());

    let chunk_res = rust_video::get_chunk(0, id).unwrap();

    assert_eq!(chunk, chunk_res);
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
        rust_video::put_chunk(chunk.clone(), i, id.clone());
    }

    for (i, chunk) in chunks.drain(..).enumerate(){
        let chunk_res = rust_video::get_chunk(i, id.clone()).unwrap();

        assert_eq!(chunk, chunk_res);
    }
}

#[test]
fn test_default_feed_length(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let _id2 = common::create_test_video_info();
    let feed_res = rust_video::get_default_feed(1);

    assert_eq!(feed_res.len(), 1);
}


#[test]
fn test_default_feed_full(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let _id2 = common::create_test_video_info();
    let feed_res = rust_video::get_default_feed(10);

    assert_eq!(feed_res.len(), 2);
}

#[test]
fn test_keyword_search() {
    common::setup();
    let _id1 = common::create_test_video_info();
    let keyword = String::from(common::TEST_VIDEO_KEYWORDS[0]);
    let res = rust_video::search_video(keyword.clone());

    assert!(res.is_some());
    assert!(res.unwrap().keywords.contains(&keyword));
}

#[test]
fn test_name_search(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let name = String::from(common::TEST_VIDEO_NAME);
    let res = rust_video::search_video(name.clone());

    assert!(res.is_some());
    assert_eq!(res.unwrap().name, name);
}

#[test]
fn test_description_search(){
    common::setup();
    let _id1 = common::create_test_video_info();
    let description = String::from(common::TEST_VIDEO_DESCRIPTION);
    let res = rust_video::search_video(description.clone());

    assert!(res.is_some());
    assert_eq!(res.unwrap().description, description);
}

#[test]
fn test_reset(){
    common::setup();
    
    for _ in 0..10{
        common::create_test_video_info();
    }

    rust_video::reset();
    let feed = rust_video::get_default_feed(10);

    assert!(feed.is_empty());
}
