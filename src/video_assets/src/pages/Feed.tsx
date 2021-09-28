import React, {useState, useEffect, useContext} from 'react';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import PostComponent from '../components/Post';
import { loadRandomFeed, loadSearchFeed } from '../services/video_backend';
import { VideoPost } from '../interfaces/video_interface';
import useQuery from '../utils/use_params';
import { LazyProfilePost } from '../interfaces/profile_interface';
import { getLazyMyProfile } from '../services/profile_backend';
import {AuthContext} from "../contexts/AuthContext";

const Feed = () => {
  const [posts, setPosts] = useState<Array<VideoPost>>([]);
  const [profile, setProfile] = useState<LazyProfilePost | null>(null);
  const [queryParams, setQueryParams] = useState<String | null>(null);
  const { identity, isAuthenticated } = useContext(AuthContext);

  // Query profile
  useEffect(() => {
    const handleProfile = async () => {
      let profile = await getLazyMyProfile(identity);
      setProfile(profile);
    };
    if (identity) handleProfile();
  }, [identity]);

  // Extract query params
  let query = useQuery();
  if (query.get("search") as String !== queryParams) {
    setQueryParams(query.get("search") as String);
  }


  // Query videos
  useEffect(() => {
    async function queryFeed() {
      try {
        const res = (queryParams)? 
        await loadSearchFeed(identity, 10, queryParams):
        await loadRandomFeed(identity, 10);
        setPosts(res);
      } catch (error) {
        console.error('Error querying feed', error);
      }
    }
    if (identity) queryFeed();
  }, [queryParams, identity]);

  return (
    <>
      <Header />
      <Grid container justify="center">
        {posts && posts.length > 0 ? (
          <>
            {posts.map((post, index) => (
              <PostComponent key={index} post={post} like={true} />
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
