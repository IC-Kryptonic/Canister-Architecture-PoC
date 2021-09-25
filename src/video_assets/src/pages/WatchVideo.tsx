import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Box, makeStyles, Grid, CircularProgress, Typography, Divider, Button, Tabs, Tab, IconButton } from '@material-ui/core';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon
} from "react-share";
import Layout from "../components/shared/Layout";
import { LazyProfilePost } from "../interfaces/profile_interface";
import { loadVideo, _loadVideoPosts } from "../services/video_backend";
import { VideoPost } from "../interfaces/video_interface";
// import { getProfile } from "../services/profile_service";
import { Principal } from "@dfinity/principal";
import VisibilityIcon from '@material-ui/icons/Visibility';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import TabPanel from "../components/shared/TabPanel";
import { getVideoOwners, getVideoBidders, getVideoLikes, getVideoViews } from "../services/videometadata_service";
import PlaceBidDialog from "../components/watchvideo/PlaceBidDialog";
import useQuery from '../utils/use_params';
import { watchVideoStyles } from "../styles/watchvideo_styles";
import { getLazyUserProfile } from "../services/profile_backend";

interface WatchVideoPathParam {
    id: string
}

const WatchVideo = () => {
    const classes = watchVideoStyles();
    const [post, setPost] = useState<VideoPost | null>(null);
    const [videoNumber, setVideoNumber] = useState(0);

    const [video, setVideo] = useState(null);
    const [profile, setProfile] = useState<LazyProfilePost | null>(null);

    let { id }: WatchVideoPathParam = useParams();

    // Extract query params
    let query = useQuery();
    if (query.get("id") && query.get("id") !== `${videoNumber}`) {
        setVideoNumber(parseInt(query.get("id")));
    }

    let history = useHistory();

    // Load initial config
    useEffect(() => {
        async function queryVideoPost() {
            try {
                let videoPrincipal = Principal.fromText(id);
                const loadedVideoInfo = (
                    await _loadVideoPosts([videoPrincipal])
                )[0];
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
                    const loadedVideo = await loadVideo(post);
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
                    const loadedProfile = await getLazyUserProfile(Principal.from(post.owner));
                    setProfile(loadedProfile);
                }
            } catch (error) {
                console.error('Error loading profile', error);
            }
        }
        queryProfile();
    }, [post]);

    // TODO: Load next video in queue
    // const loadNext = async (loadNext: boolean) => {
    //     let videoToLoad = videoNumber;
    //     if (loadNext) {
    //         videoToLoad = videoToLoad - 1;
    //     } else {
    //         videoToLoad = videoToLoad + 1;
    //     }
    //     let { post, id } = (await getNextVideo(videoToLoad));
    //     console.info(post);
    //     history.push(`/video/${post.video_id}?id=${id}`);
    //     setPost(post);
    //     // Null other attributes to cause a rerender
    //     setVideo(null);
    //     setProfile(null);
    // }

    return (
        <Layout title={"test"} marginTop={0}>
            <Box display="flex" flexWrap="nowrap" justifyContent="space-evenly" alignItems="stretch">
                {/* <VideoControls loadNext={loadNext} /> */}
                <VideoBox video={video} />
                <MetaDataBox post={post} profile={profile} />
            </Box>
        </Layout>
    );
}

interface VideoControlsProps {
    loadNext: (next: boolean) => void
}

const VideoControls = ({ loadNext }: VideoControlsProps) => {
    const classes = watchVideoStyles();

    return (
        <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" className={classes.arrowControlWrapper}>
            <Button onClick={() => loadNext(false)}>
                <ArrowDropUpIcon className={classes.arrowControl} />
            </Button>
            <Button onClick={() => loadNext(true)}>
                <ArrowDropDownIcon className={classes.arrowControl} />
            </Button>
        </Box>
    );
}

interface VideoBoxProps {
    video?: string
}

const VideoBox = ({ video }: VideoBoxProps) => {
    const classes = watchVideoStyles();
    //let key = (post)? post.video_id: "";
    let content = video ? (
        <video controls className={classes.videoPlayer}>
            <source src={video} type="video/mp4" />
        </video>
    ) : (
        <CircularProgress />
    );

    return (
        <Box /*key={key}*/ className={classes.videoBox} display="flex" justifyContent="center" alignItems="center">
            {content}
        </Box>
    );
}

interface MetaDataBoxProperties {
    post?: VideoPost,
    profile?: LazyProfilePost
}

const MetaDataBox = ({ post, profile }: MetaDataBoxProperties) => {
    const classes = watchVideoStyles();
    const [viewNumber, setViewNumber] = useState(0);
    const [likeNumber, setLikeNumber] = useState(0);

    useEffect(() => {
        if (post) {
            setViewNumber(getVideoViews(post?.storageType.canister.toString()));
            setLikeNumber(getVideoLikes(post?.storageType.canister.toString()));
        }
    }, [post]);

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
                    <Typography align="center" variant="h4"><b>{post?.name}</b></Typography>
                    <Divider />
                    <Typography align="left" variant="body1">{post?.description}</Typography>
                </Box>
            </Grid>

            <Grid item>
                <Box display="flex" flexWrap="no-wrap" justifyContent="space-around" className={classes.videoStatisticsWrapper}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <VisibilityIcon className={classes.videoStatistic} />{viewNumber}
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <FavoriteIcon className={classes.videoStatistic} />{likeNumber}
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
                        <Link to={`/profile/${profile?.principal.toText()}`} style={{ color: 'inherit', textDecoration: 'inherit' }} >
                            {profile?.name}
                        </Link>
                    </Box>
                </Box>
                {/* <Button>Follow</Button> */}
            </Grid>

            <Grid item>
                <OwnerBidSection profile={profile} />
            </Grid>

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
        </Grid>
    );
};

interface OwnerBidSectionProps {
    profile: LazyProfilePost
}

const OwnerBidSection = ({ profile }: OwnerBidSectionProps) => {
    const classes = watchVideoStyles();

    const [value, setValue] = useState(0);
    const [videoOwners, setVideoOwners] = useState(getVideoOwners());
    const [videoBidders, setVideoBidders] = useState(getVideoBidders());
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number) => {
        setValue(newValue);
    };

    const handleDialogClose = (bid: number) => {
        if (bid > 0) {
            setVideoBidders(oldBidders =>
                [...oldBidders, {
                    name: profile.name,
                    bid: bid
                }]
            )
        }
        setDialogOpen(false);
    }

    return (
        <Box>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Owners" />
                <Tab label="Offers" />
            </Tabs>
            <TabPanel value={value} index={0}>
                {
                    videoOwners.map(owner => {
                        return (
                            <Box display="flex" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <AccountCircle />
                                    <Typography align="left">{owner.name}</Typography>
                                </Box>
                                <Typography align="right">{owner.shares} {owner.shares > 1 ? "shares" : "share"}</Typography>
                            </Box>
                        );
                    })
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {
                    videoBidders.map(bidder => {
                        return (
                            <Box display="flex" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <AccountCircle />
                                    <Typography align="left">{bidder.name}</Typography>
                                </Box>
                                <Typography align="right">{bidder.bid}</Typography>
                            </Box>
                        );
                    })
                }
            </TabPanel>
            <PlaceBidDialog open={dialogOpen} handleClose={handleDialogClose} />
            <Box display="flex" justifyContent="center">
                <Button variant="contained" color="secondary" className={classes.bidButton} onClick={() => setDialogOpen(true)}>
                    <Typography align="center" variant="subtitle2">
                        Go to marketplace
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
}

export default WatchVideo;