import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab,
} from '@material-ui/core';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import Layout from '../components/shared/Layout';
import { LazyProfilePost } from '../interfaces/profile_interface';
import { getRandomNextVideoPost, loadVideo, loadVideoPost } from '../services/video_backend';
import { VideoPost } from '../interfaces/video_interface';
// import { getProfile } from "../services/profile_service";
import { Principal } from '@dfinity/principal';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import TabPanel from '../components/shared/TabPanel';
import {
  getVideoOwners,
  getVideoBidders,
  getVideoLikes,
  getVideoViews,
} from '../services/videometadata_service';
import { watchVideoStyles } from "../styles/watchvideo_styles";
import { getLazyUserProfile } from "../services/profile_backend";
import { AuthContext } from "../contexts/AuthContext";
import history from '../components/History';
import { loadRandomAdPost, watchedAd } from '../services/ad_manager';
import { AdPost } from '../interfaces/ad_interface';

interface WatchVideoPathParam {
  id: string;
}

const WatchVideo = () => {
  const { identity } = useContext(AuthContext);

  const classes = watchVideoStyles();
  // General state variables
  const [post, setPost] = useState<VideoPost | null>(null);
  const [video, setVideo] = useState(null);
  const [profile, setProfile] = useState<LazyProfilePost | null>(null);

  // Ad state variables
  const [isVideo, setIsVideo] = useState(true);
  const [prevVideoPrincipal, setPrevVideoPrincipal] = useState<Principal | null>(null);
  const [watchedVideos, setWatchedVideos] = useState(1);
  const addPlaybackRate = 3;
  console.log("Currently played videos: " + watchedVideos);

  let { id }: WatchVideoPathParam = useParams();

  let history = useHistory();

  // Load initial config
  useEffect(() => {
    async function queryVideoPost() {
      try {
        let videoPrincipal = Principal.fromText(id);
        const loadedVideoInfo = (await loadVideoPost(identity, videoPrincipal));
        setPost(loadedVideoInfo);
        // console.log(loadedVideoInfo);
      } catch (error) {
        console.error('Error loading video', error);
      }
    }
    queryVideoPost();
  }, []);

  // Refresh when post is changed
  useEffect(() => {
    async function queryVideo() {
      try {
        if (post) {
          const loadedVideo = await loadVideo(identity, post);
          setVideo(loadedVideo);
        }
      } catch (error) {
        console.error('Error loading video', error);
      }
    }
    queryVideo();
  }, [post]);

  useEffect(() => {
    async function queryProfile() {
      try {
        if (post) {
          const loadedProfile = await getLazyUserProfile(identity, Principal.from(post.owner));
          setProfile(loadedProfile);
        }
      } catch (error) {
        console.error('Error loading profile', error);
      }
    }
    queryProfile();
  }, [post]);

  // Load next video in queue
  const loadNext = async (loadNext: boolean) => {
    // increment watched videos
    setWatchedVideos(watchedVideos + 1);
    if (watchedVideos % addPlaybackRate == 0) {
      // Play add
      let post = await loadRandomAdPost(identity);
      setPrevVideoPrincipal(post.storageType.canister);
      setIsVideo(false);
      setPost(post);
    } else {
      // TODO: Get a real random video call
      let { post } = await getRandomNextVideoPost(identity, watchedVideos, 10);
      history.push(`/video/${post.storageType.canister}`);
      setIsVideo(true);
      setPost(post);
    }
    // Null other attributes to cause a rerender
    setVideo(null);
    setProfile(null);
  };

  const adWatched = () => {
    // TODO: Fix this call
    watchedAd(identity, post.storageType.canister, prevVideoPrincipal);
    loadNext(true);
  }

  return (
    <Layout title={'test'} marginTop={0}>
      <Box display="flex" flexWrap="nowrap" justifyContent="space-evenly" alignItems="stretch">
        <VideoControls loadNext={loadNext} isVideo={isVideo} />
        <VideoBox video={video} isVideo={isVideo} adWatched={adWatched} />
        <MetaDataBox post={post} profile={profile} isVideo={isVideo} />
      </Box>
    </Layout>
  );
};

interface VideoControlsProps {
  loadNext: (next: boolean) => void;
  isVideo: Boolean;
}

const VideoControls = ({ loadNext, isVideo }: VideoControlsProps) => {
  const classes = watchVideoStyles();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      className={classes.arrowControlWrapper}
    >
      { isVideo ? (
        <>
          <Button onClick={() => loadNext(false)}>
            <ArrowDropUpIcon className={classes.arrowControl} />
          </Button>
          <Button onClick={() => loadNext(true)}>
            <ArrowDropDownIcon className={classes.arrowControl} />
          </Button>
        </>
      ) : <></>}

    </Box>
  );
};

interface VideoBoxProps {
  video?: string;
  isVideo?: Boolean;
  adWatched?: () => void;
}

const VideoBox = ({ video, isVideo, adWatched }: VideoBoxProps) => {
  const classes = watchVideoStyles();
  //let key = (post)? post.video_id: "";
  let content = video ? (
    isVideo ? (
      <video controls autoPlay className={classes.videoPlayer}>
        <source src={video} type="video/mp4" />
      </video>
    ) : (<>
          <video autoPlay muted className={classes.dimmedVideoPlayer} onEnded={adWatched}>
            <source src={video} type="video/mp4" />
          </video>
        </>
      )
  ) : (
      <CircularProgress />
    );

  return (
    <Box
      /*key={key}*/ className={classes.videoBox}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {content}
    </Box>
  );
};

interface MetaDataBoxProperties {
  post?: VideoPost;
  profile?: LazyProfilePost;
  isVideo?: Boolean;
}

const MetaDataBox = ({ post, profile, isVideo }: MetaDataBoxProperties) => {
  const classes = watchVideoStyles();
  const [viewNumber, setViewNumber] = useState(0);
  const [likeNumber, setLikeNumber] = useState(0);

  useEffect(() => {
    if (post) {
      setViewNumber(getVideoViews(post?.storageType.canister.toString()));
      setLikeNumber(getVideoLikes(post?.storageType.canister.toString()));
    }
  }, [post]);

  let videoContent = (
    <>
      <Grid item>
        <Box
          display="flex"
          flexWrap="no-wrap"
          justifyContent="space-around"
          className={classes.videoStatisticsWrapper}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <VisibilityIcon className={classes.videoStatistic} />
            {viewNumber}
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <FavoriteIcon className={classes.videoStatistic} />
            {likeNumber}
          </Box>
        </Box>
      </Grid>

      <Grid item>
        <Box display="flex" flexWrap="no-wrap" justifyContent="center">
          <Typography align="center" variant="h6" className={classes.textLabel}>
            Created by
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center">
            <AccountCircle className={classes.shareIcon} />
            <Link
              to={`/profile/${profile?.principal.toText()}`}
              style={{ color: 'inherit', textDecoration: 'inherit' }}
            >
              {profile?.name}
            </Link>
          </Box>
        </Box>
        {/* <Button>Follow</Button> */}
      </Grid>

      {/* <Grid item>
        <OwnerBidSection profile={profile} />
      </Grid> */}

      <Grid item>
        <Box display="flex" flexWrap="no-wrap" justifyContent="center">
          <Typography align="center" variant="h6" className={classes.textLabel}>
            Share to
          </Typography>
          <Box display="flex" flexWrap="no-wrap" justifyContent="center">
            <FacebookShareButton url={window.location.href} className={classes.shareIcon}>
              <FacebookIcon className={classes.shareIcon} />
            </FacebookShareButton>
            <TwitterShareButton url={window.location.href} className={classes.shareIcon}>
              <TwitterIcon className={classes.shareIcon} />
            </TwitterShareButton>
            <WhatsappShareButton url={window.location.href} className={classes.shareIcon}>
              <WhatsappIcon className={classes.shareIcon} />
            </WhatsappShareButton>
          </Box>
        </Box>
      </Grid>
    </>
  );

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      spacing={2}
      className={classes.metadataBox}
    >
      <Grid item className={classes.fullWidth}>
        <Box className={classes.titleBox}>
          <Typography align="center" variant="h4">
            <b>{post?.name}</b>
          </Typography>
          <Divider />
          <Typography align="left" variant="body1">
            {post?.description}
          </Typography>
        </Box>
      </Grid>

      { isVideo ? videoContent : <></>}

    </Grid>
  );
};

interface OwnerBidSectionProps {
  profile: LazyProfilePost;
}

const OwnerBidSection = ({ profile }: OwnerBidSectionProps) => {
  const classes = watchVideoStyles();

  const [value, setValue] = useState(0);
  const [videoOwners, setVideoOwners] = useState(getVideoOwners());
  const [videoBidders, setVideoBidders] = useState(getVideoBidders());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Owners" />
        <Tab label="Offers" />
      </Tabs>
      <TabPanel value={value} index={0}>
        {videoOwners.map((owner, index) => {
          return (
            <Box key={index} display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <AccountCircle />
                <Typography component={'div'} align="left">
                  {owner.name}
                </Typography>
              </Box>
              <Typography component={'div'} align="right">
                {owner.shares} {owner.shares > 1 ? 'shares' : 'share'}
              </Typography>
            </Box>
          );
        })}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {videoBidders.map((bidder, index) => {
          return (
            <Box key={index} display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <AccountCircle />
                <Typography component={'div'} align="left">
                  {bidder.name}
                </Typography>
              </Box>
              <Typography component={'div'} align="right">
                {bidder.bid}
              </Typography>
            </Box>
          );
        })}
      </TabPanel>
    </Box>
  );
};

export default WatchVideo;
