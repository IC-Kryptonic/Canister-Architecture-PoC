import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { postStyles } from '../styles/post_styles';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { Principal } from "@dfinity/principal";

import { trimString } from '../utils/texts';
import { loadVideo } from '../services/video_backend';
import { getProfile } from '../services/profile_service';
import { Post } from '../interfaces/video_interface';

interface PostProps {
  post: Post;
}

const Post = ({ post }: PostProps) => {
  
  const classes = postStyles();
  const [video, setVideo] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function queryVideo() {
      try {
        const loadedVideo = await loadVideo(post);
        setVideo(loadedVideo);
        const loadedProfile = await getProfile(Principal.from(post.owner));
        setProfile(loadedProfile);
        console.info(loadedProfile);
      } catch (error) {
        console.error('Error loading video', error);
      }
    }
    queryVideo();
  }, [post]);
  return (
    <Grid container justify="center">
      <Grid container className={classes.postContainer}>
        {/* Post header with user info & follow button */}
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Grid container>
              <Grid item>
               <AccountCircle className={classes.userProfile}/>
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item>
                    <strong>{profile?.name || '<<username>>'}</strong>
                  </Grid>
                  <Grid item className={classes.lightText}>
                    {post?.video_id
                      ? trimString(post.video_id, 15)
                      : '<<video_id>>'}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item>{post?.name || '<<name>>'}</Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item>{post?.description || '<<description>>'}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button className={classes.followButton}>Follow</Button>
          </Grid>
        </Grid>
        {/* Post body with video */}
        <Grid container justify="center">
          {video ? (
            <video controls className={classes.video}>
              <source src={video} type="video/mp4" />
            </video>
          ) : (
            <CircularProgress className={classes.loadingSpinner} />
          )}
        </Grid>
        {/* Post footer with likes and views */}
        <Grid container spacing={1}>
          <Grid item>
            <FavoriteBorderIcon />
          </Grid>
          <Grid item>
            <VisibilityIcon />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Post;
