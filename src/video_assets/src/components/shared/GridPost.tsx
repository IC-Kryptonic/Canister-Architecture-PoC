import React, {useState, useEffect, useContext} from "react";
import { useGridPostStyles } from "../../styles/shared_styles";
import { Typography, CircularProgress, Box } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { VideoPost } from "../../interfaces/video_interface";
import { loadVideo } from '../../services/video_backend';
import { getVideoLikes, getVideoViews } from "../../services/videometadata_service";
import OnHoverVideoPlayer from "./OnHoverVideoPlayer";
import {AuthContext} from "../../contexts/AuthContext";
import { AccountCircle } from "@material-ui/icons";

interface GridPostInterface {
    post: VideoPost
}

function GridPost({ post }: GridPostInterface) {
    const { identity } = useContext(AuthContext);
    const history = useHistory();
    const classes = useGridPostStyles();
    const [video, setVideo] = useState(null);

    useEffect(() => {
        async function queryVideo() {
            try {
                const loadedVideo = await loadVideo(identity, post);
                setVideo(loadedVideo);
            } catch (error) {
                console.error('Error loading video', error);
            }
        }
        queryVideo();
    }, [post]);

    const [viewNumber, setViewNumber] = useState(0);
    const [likeNumber, setLikeNumber] = useState(0);

    useEffect(() => {
        if (post) {
            setViewNumber(getVideoViews(post.storageType.canister.toString()));
            setLikeNumber(getVideoLikes(post.storageType.canister.toString()));
        }
    }, [post]);

    return (
        <Link to={`/video/${post.storageType.canister}`} style={{ color: 'inherit', textDecoration: 'inherit' }} >
            <div className={classes.gridPostContainer}>
                {video ? (
                    <OnHoverVideoPlayer video={video} viewNumber={viewNumber} likeNumber={likeNumber}/>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" className={classes.videoPlaceholder}>
                        <CircularProgress className={classes.loadingSpinner} />
                    </Box>
                )}
                <Box display="flex" alignItems="center">
                    <AccountCircle className={classes.profileIcon} />
                    <Typography><b>{post.name}</b></Typography>
                </Box>
            </div>
        </Link>
    );
}

export default GridPost;
