import React, { useState, ReactElement } from 'react';
import HoverVideoPlayer from 'react-hover-video-player';
import { JsxElement } from 'typescript';
import { OnHoverVideoPlayerStyles } from '../../styles/shared_styles';
import VisibilityIcon from "@material-ui/icons/Visibility";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Box, makeStyles, Typography } from '@material-ui/core';

interface OnHoverVideoPlayer {
  video: string,
  overlay?: ReactElement,
  viewNumber?: Number,
  likeNumber?: Number
}

const onHoverVideoStyles = makeStyles((theme) => ({
  gridPostOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    height: 144,
    width: 256,
  },
  icon: {
    color: "white"
  },
  iconBox: {
    marignLeft: 5,
    marginRight: 5
  }
}));

function OnHoverVideoPlayer({ video, overlay, viewNumber, likeNumber }: OnHoverVideoPlayer) {

  const hoverVideoStyle = OnHoverVideoPlayerStyles;
  const classes = onHoverVideoStyles();

  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <HoverVideoPlayer
      videoSrc={video}
      videoStyle={
        hoverVideoStyle.videoElem
      }
      pausedOverlay={
        (showOverlay) ?
          <Box display="flex" justifyContent="center" alignItems="center" className={classes.gridPostOverlay}>
            <Box display="flex" className={classes.iconBox}>
              <VisibilityIcon className={classes.icon} />
              <Typography>{viewNumber}</Typography>
            </Box>
            <Box display="flex" className={classes.iconBox}>
              <FavoriteIcon className={classes.icon} />
              <Typography>{likeNumber}</Typography>
            </Box>
          </Box> : <></>
      }
      onHoverStart={() => {
        setShowOverlay(false);
      }}
      onHoverEnd={() => {
        setShowOverlay(true);
      }}
    />
  );
}

export default OnHoverVideoPlayer;