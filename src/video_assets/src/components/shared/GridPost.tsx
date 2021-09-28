import React, {useState, useEffect, useContext} from "react";
import { useGridPostStyles } from "../../styles/shared_styles";
import { Typography, CircularProgress } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { VideoPost } from "../../interfaces/video_interface";
import { loadVideo } from '../../services/video_backend';

import FavoriteIcon from '@material-ui/icons/Favorite';
import OnHoverVideoPlayer from "./OnHoverVideoPlayer";
import {AuthContext} from "../../contexts/AuthContext";

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

    function handleOpenPostModal() {
        // history.push({
        //   pathname: `/p/${post.id}`,
        //   state: { modal: true },
        // });
    }

    //   const likesCount = post.likes_aggregate.aggregate.count;
    //   const commentsCount = post.comments_aggregate.aggregate.count;
    const likesCount = 0;
    const commentsCount = 0;

    return (
        <div onClick={handleOpenPostModal} className={classes.gridPostContainer}>
            {/* TODO: Find a way to integrate or remove 
            <div className={classes.gridPostOverlay}>
                <div className={classes.gridPostInfo}>
                    <FavoriteIcon />
                    <Typography>{likesCount}</Typography>
                </div>
            </div> */}
            {video ? (
                // <video controls className={classes.video}>
                //     <source src={video} type="video/mp4" />
                // </video>
                <OnHoverVideoPlayer video={video} />
            ) : (
                <CircularProgress className={classes.loadingSpinner} />
            )}
            <Link to={`/video/${post.storageType.canister}`} style={{ color: 'inherit', textDecoration: 'inherit' }} >
                <Typography>{post.name}</Typography>
            </Link>
        </div>
    );
}

export default GridPost;
