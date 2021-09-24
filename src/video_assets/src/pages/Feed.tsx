import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import PostComponent from '../components/Post';
import { loadRandomFeed } from '../services/video_backend';
import { VideoPost } from '../interfaces/video_interface';

const Feed = () => {
  const [posts, setPosts] = useState<Array<VideoPost>>([]);

  useEffect(() => {
    async function queryFeed() {
      try {
        const res = await loadRandomFeed(10);
        setPosts(res);
      } catch (error) {
        console.error('Error querying feed', error);
      }
    }
    queryFeed();
  }, []);

  return (
    <>
      <Header />
      <Grid container justify="center">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <PostComponent key={index} post={post} />
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
