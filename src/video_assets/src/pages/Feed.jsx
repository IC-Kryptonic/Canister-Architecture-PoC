import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import Post from '../components/Post';
import { loadDefaultFeed } from '../services/video_backend';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [userToToggle, setUserToToggle] = useState(null);

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

  //toggle user from followed to unfollowed
  if (userToToggle) {
    //do something to follow / unfollow
    setUserToToggle(null);
  }

  return (
    <>
      <Header />
      <Grid container justify="center">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <Post
                key={index}
                post={post}
                toggleFollow={(userToToggle) => setUserToToggle(userToToggle)}
              />
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
