import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import PostComponent from '../Post';
import { loadDefaultFeed } from '../../services/video_backend';
import { Post } from '../../interfaces/video_interface';
import VideoElem from './VideoElem';

const VideoList = () => {
  const [posts, setPosts] = useState<Array<Post>>([]);

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

  return (
      <Grid container justify="center">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <VideoElem key={index} post={post} />
            ))}
          </>
        ) : (
          <span>You have no uploaded videos yet :)</span>
        )}
      </Grid>
  );
};

export default VideoList;
