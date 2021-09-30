import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Layout from '../components/shared/Layout';
import PostComponent from '../components/Post';
import { loadRandomFeed, loadSearchFeed } from '../services/video_backend';
import { VideoPost } from '../interfaces/video_interface';
import useQuery from '../utils/use_params';
import { LazyProfilePost } from '../interfaces/profile_interface';
import { getLazyMyProfile } from '../services/profile_backend';
import { useFeedStyles } from '../styles/feed_styles';
import GridPost from '../components/shared/GridPost';

const Feed = () => {
  const classes = useFeedStyles();
  const [posts, setPosts] = useState<Array<VideoPost>>([]);
  const [profile, setProfile] = useState<LazyProfilePost | null>(null);
  const [queryParams, setQueryParams] = useState<String | null>(null);

  // Query profile
  useEffect(() => {
    const handleProfile = async () => {
      let profile = await getLazyMyProfile();
      setProfile(profile);
    };
    handleProfile();
  }, []);

  // Extract query params
  let query = useQuery();
  if ((query.get('search') as String) !== queryParams) {
    setQueryParams(query.get('search') as String);
  }

  // Query videos
  useEffect(() => {
    async function queryFeed() {
      try {
        const res = queryParams ? await loadSearchFeed(10, queryParams) : await loadRandomFeed(10);
        setPosts(res);
      } catch (error) {
        console.error('Error querying feed', error);
      }
    }
    queryFeed();
  }, [queryParams]);

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
      ) : (
        <span>So far, no videos have been uploaded to our platform :(</span>
      )}
    </Layout>
  );
};

export default Feed;
