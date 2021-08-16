import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import PostComponent from '../components/Post';
import { loadDefaultFeed } from '../services/video_backend';
import { loadProfile, likeVideo } from '../services/profile_service';
import { Post } from '../interfaces/video_interface';
import { Profile } from '../interfaces/profile_interface';

const Feed = () => {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Query profile
  useEffect(() => {
    const handleProfile = async () => {
      let profile = await loadProfile();
      setProfile(profile);
    };
    handleProfile();
  }, []);

  // Query videos
  useEffect(() => {
    async function queryFeed() {
      try {
        const res = await loadDefaultFeed(10);
        setPosts(res);
      } catch (error) {
        console.error('Error querying feed', error);
      }
    }
    queryFeed();
  }, []);

  const likeVideoHandler = async (videoId: String) => {
    setProfile({...profile, likes: profile.likes.concat([videoId])});
    await likeVideo(videoId);
  }

  console.log(profile);

  return (
    <>
      <Header />
      <Grid container justify="center">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <PostComponent key={index} post={post} like={profile && profile.likes.includes(post.video_id[0])} likeVideo={likeVideoHandler}/>
            ))}
          </>
        ) : (
          <span>In deinem Feed gibt es noch keine Videos :)</span>
        )}
      </Grid>
    </>
  );
};

export default Feed;
