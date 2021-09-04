import React, { useState, useEffect } from "react";
import { useGridPostStyles } from "../../styles/shared_styles";
import { Typography, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Post } from "../../interfaces/video_interface";
import { loadVideo } from '../../services/video_backend';

import FavoriteIcon from '@material-ui/icons/Favorite';

interface GridPostInterface {
   post: Post
}

function GridPost({ post }: GridPostInterface) {
    const history = useHistory();
    const classes = useGridPostStyles();
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
            <div className={classes.gridPostOverlay}>
                <div className={classes.gridPostInfo}>
                    <FavoriteIcon />
                    <Typography>{likesCount}</Typography>
                </div>
            </div>
            {video ? (
                <video controls className={classes.video}>
                    <source src={video} type="video/mp4" />
                </video>
            ) : (
                <CircularProgress className={classes.loadingSpinner} />
            )}
        </div>
    );
}

export default GridPost;
