import React from 'react';
import HoverVideoPlayer from 'react-hover-video-player';
import { OnHoverVideoPlayerStyles } from '../../styles/shared_styles';

interface OnHoverVideoPlayer {
  video: string
}

function OnHoverVideoPlayer({ video }: OnHoverVideoPlayer) {

  const classes = OnHoverVideoPlayerStyles;

  return (
    <HoverVideoPlayer
      videoSrc={video}
      videoStyle={
        classes.videoElem
      }
    />
  );
}

export default OnHoverVideoPlayer;