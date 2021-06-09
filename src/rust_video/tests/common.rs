use ic_cdk::export::Principal;

use rust_video;

pub static TEST_VIDEO_NAME: &str = "test";
pub static TEST_VIDEO_DESCRIPTION: &str = "this is a test";
pub static TEST_VIDEO_KEYWORDS: &[&str] = &["keyword1", "keyword2"];
pub static TEST_VIDEO_CHUNK_COUNT: usize = 0;

pub fn create_test_video_info() -> rust_video::VideoId{

    let test_video: rust_video::VideoInfo = rust_video::VideoInfo{
        video_id: String::new(),
        owner: Principal::from_slice(&[]),
        name: String::from(TEST_VIDEO_NAME),
        description: String::from(TEST_VIDEO_DESCRIPTION),
        keywords: TEST_VIDEO_KEYWORDS.iter().map(|&w| String::from(w)).collect(),
        chunk_count: TEST_VIDEO_CHUNK_COUNT,
    };

    return rust_video::create_video(test_video);
}

pub fn create_test_video_info_with_chunks(chunks: usize) -> rust_video::VideoId{
    let test_video: rust_video::VideoInfo = rust_video::VideoInfo{
        video_id: String::new(),
        owner: Principal::from_slice(&[]),
        name: String::from(TEST_VIDEO_NAME),
        description: String::from(TEST_VIDEO_DESCRIPTION),
        keywords: TEST_VIDEO_KEYWORDS.iter().map(|&w| String::from(w)).collect(),
        chunk_count: chunks,
    };

    return rust_video::create_video(test_video);
}

pub fn setup(){
    rust_video::reset();
}
