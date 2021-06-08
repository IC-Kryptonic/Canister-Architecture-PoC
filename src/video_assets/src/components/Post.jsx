import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { postStyles } from '../styles/post_styles';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import VisibilityIcon from '@material-ui/icons/Visibility';

const Post = ({ user, toggleFollow }) => {
  const classes = postStyles();
  return (
    <Grid container justify="center">
      <Grid container className={classes.postContainer}>
        {/* Post header with user info & follow button */}
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Grid container>
              <Grid item>
                <img
                  className={classes.userProfile}
                  src={user.avatar}
                  width={'100%'}
                />
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item>
                    <strong>{user.username}</strong>
                  </Grid>
                  <Grid item className={classes.lightText}>
                    {user.name}
                  </Grid>
                  <Grid item className={classes.lightText}>
                    {user.timestamp}
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item>{user.caption}</Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            {user.button_visible && (
              <Button
                className={
                  user.is_followed
                    ? classes.followingButton
                    : classes.followButton
                }
                onClick={() => toggleFollow(user)}
              >
                {user.is_followed ? 'Following' : 'Follow'}
              </Button>
            )}
          </Grid>
        </Grid>
        {/* Post body with video */}
        <Grid container justify="center">
          <video controls className={classes.video}>
            <source src={user.video} type="video/mp4" />
          </video>
        </Grid>
        {/* Post footer with likes and views */}
        <Grid container spacing={1}>
          <Grid item>
            <FavoriteBorderIcon />
          </Grid>
          <Grid item>{user.likes}</Grid>
          <Grid item>
            <VisibilityIcon />
          </Grid>
          <Grid item>{user.views}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Post;
