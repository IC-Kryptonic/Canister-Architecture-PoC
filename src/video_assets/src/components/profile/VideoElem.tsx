import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { postStyles } from '../../styles/post_styles';
import { loadVideo } from '../../services/video_backend';
import { Post } from '../../interfaces/video_interface';

interface PostProps {
  post: Post;
}

/** Wrapper for videos in the profile view
 * 
 * @param param0 
 * @returns 
 */
const VideoElem = ({ post }: PostProps) => {
  const classes = postStyles();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    async function queryVideo() {
      try {
        const loadedVideo = await loadVideo(post);
        setVideo(loadedVideo);
      } catch (error) {
        console.error('Error loading video', error);
      }
    }
    queryVideo();
  }, [post]);
  return (
    <Grid container justify="center">
      <Grid container className={classes.postContainer}>
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
      </Grid>
    </Grid>
  );
};

export default VideoElem;
