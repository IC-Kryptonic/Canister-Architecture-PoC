import React, {useState, useEffect, useContext} from 'react';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import Layout from "../components/shared/Layout";
import PostComponent from '../components/Post';
import { CircularProgress } from '@material-ui/core';
import { loadRandomFeed, loadSearchFeed } from '../services/video_backend';
import { VideoPost } from '../interfaces/video_interface';
import useQuery from '../utils/use_params';
import { LazyProfilePost } from '../interfaces/profile_interface';
import { getLazyMyProfile } from '../services/profile_backend';
import { useFeedStyles } from '../styles/feed_styles';
import GridPost from '../components/shared/GridPost';
import {AuthContext} from "../contexts/AuthContext";

const Feed = () => {
  const classes = useFeedStyles();
  const [posts, setPosts] = useState<Array<VideoPost>>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
  if ((query.get('search') as String) !== queryParams) {
    setQueryParams(query.get('search') as String);
  }

  // Query videos
  useEffect(() => {
    async function queryFeed() {
      try {
        setLoading(true);
        const res = queryParams ? await loadSearchFeed(identity, 10, queryParams) : await loadRandomFeed(identity, 100);
        setPosts(res);
      } catch (error) {
        console.error('Error querying feed', error);
      } finally {
        setLoading(false);
      }
    }
    if (identity) queryFeed();
  }, [queryParams, identity]);

  return (
    <Layout title={'Feed'} marginTop={20}>
      {posts && posts.length > 0 ? (
        <article className={classes.article}>
          <div className={classes.gridContainer}>
            {posts.map((post, index) => (
              <GridPost key={index} post={post} />
            ))}
          </div>
        </article>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <span>So far, no videos have been uploaded to our platform.</span>
      )}
    </Layout>
  );
};

export default Feed;
