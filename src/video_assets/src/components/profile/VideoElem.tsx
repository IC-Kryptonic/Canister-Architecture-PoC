import React, { useState, useEffect } from 'react';
import { Grid, Button, CircularProgress, Typography, makeStyles } from '@material-ui/core';
import { postStyles } from '../../styles/post_styles';
import { loadVideo } from '../../services/video_backend';
import { Post } from '../../interfaces/video_interface';

const videoStyles = makeStyles({
  video_elem: {
      borderRadius: "10px",
      padding: "5px",
      color: "white",
      backgroundColor: "black"
  }
});

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
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      <Grid item>
        <Typography>{post.name}</Typography>
        {video ? (
          <video controls className={classes.video}>
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <CircularProgress className={classes.loadingSpinner} />
        )}
      </Grid>
    </Grid>
  );
};

export default VideoElem;
