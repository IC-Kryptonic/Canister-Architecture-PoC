import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, Button, CircularProgress, IconButton, Typography } from '@material-ui/core';
import { postStyles } from '../styles/post_styles';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Collapsible from "react-collapsible-paragraph";

import { Principal } from "@dfinity/principal";

import { trimString } from '../utils/texts';
import { loadVideo } from '../services/video_backend';
import { getProfile, followProfile, unfollowProfile } from '../services/profile_service';
import { Post } from '../interfaces/video_interface';
import { Profile } from '../interfaces/profile_interface';

interface PostProps {
  post: Post;
  like: Boolean;
  likeVideo: (id: String) => void;
}

const Post = ({ post, like, likeVideo }: PostProps) => {

  const classes = postStyles();
  const [video, setVideo] = useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);

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

  const likeButtonHandler = async (videoId: String) => {
    likeVideo(videoId);
  }

  const followHandler = async () => {
    if (profile) {
      followProfile(Principal.from(profile.principal));
    }
  }

  const unfollowHandler = async () => {
    if (profile) {
      unfollowProfile(Principal.from(profile.principal));
    }
  }

  return (
    <Grid container justify="center">
      <Grid container className={classes.postContainer}>
        {/* Post header with user info & follow button */}
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Link to={`/profile/${profile?.principal.toText()}`} style={{ color: 'inherit', textDecoration: 'inherit' }} >
              <Box display="flex" justifyContent="left" alignItems="center">
                <AccountCircle className={classes.userProfile} />
                <strong>{profile?.name || '<<username>>'}</strong>
              </Box>
            </Link>
          </Grid>
          <Grid item className={classes.lightText}>
            {post?.video_id
              ? (
                <Link to={`/video/${post.video_id}`} style={{ color: 'inherit', textDecoration: 'inherit' }} >
                  {trimString(post.video_id[0], 30)}
                </Link>
              )
              : '<<video_id>>'}
          </Grid>
          <Grid item>
            <Button className={classes.followButton} onClick={followHandler}>Follow</Button>
          </Grid>
        </Grid>
        {/* Title and description */}
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography align="left">
              {post?.name || '<<name>>'}
            </Typography>
          </Grid>
          <Grid item>
            <Collapsible lines={2}>
              {post?.description || '<<description>>'}
            </Collapsible>
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
            {
              like ? (
                <IconButton className={classes.bottomButton}>
                  <FavoriteIcon />
                </IconButton>
              ) : (
                <IconButton className={classes.bottomButton} onClick={() => likeButtonHandler(post.video_id[0])}>
                  <FavoriteBorderIcon />
                </IconButton>
              )
            }
          </Grid>
          <Grid item>
            <IconButton className={classes.bottomButton}>
              <VisibilityIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid >
    </Grid >
  );
};

export default Post;
