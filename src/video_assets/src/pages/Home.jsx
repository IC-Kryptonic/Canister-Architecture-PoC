import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import Post from '../components/Post';
import { mockedPosts } from '../mock/mocked_posts';

const Home = () => {
  const [posts, setPosts] = useState(mockedPosts);
  const [userToToggle, setUserToToggle] = useState(null);

  //toggle user from followed to unfollowed
  if (userToToggle) {
    //do something to follow / unfollow
    setUserToToggle(null);
  }

  return (
    <>
      <Header />
      <Grid container justify="center">
        {posts && (
          <>
            {posts.map((post, index) => (
              <Post
                key={index}
                user={post}
                toggleFollow={(userToToggle) => setUserToToggle(userToToggle)}
              />
            ))}
          </>
        )}
      </Grid>
    </>
  );
};

export default Home;
