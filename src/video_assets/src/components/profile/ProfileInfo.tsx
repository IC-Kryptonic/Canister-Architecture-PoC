import React, { useState, useEffect } from "react";
import { Box, Grid, Paper, makeStyles, Button, Typography } from "@material-ui/core"
import { Profile } from "../../interfaces/profile_interface";
import { Post } from '../../interfaces/video_interface';
import { getProfileLikes } from '../../services/profile_service';

import { Identity } from '@dfinity/agent';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import ProfileIcon from "./ProfileIcon";
import ProfileId from "./ProfileId";
import EditProfileDialog from "./EditProfileDialog";
import BioBox from "./BioBox";

interface ProfileProps {
    profile: Profile;
    identity: Identity;
    posts: Array<Post>;
    reloadProfile: () => void;
}

const headerStyles = makeStyles({
    profile_logo: {
        width: 100,
        height: 100,
    },
    paper: {
    },
    wrapper: {
        padding: "20px"
    },
    profile_likes: {
        width: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center"
    }
});

const ProfileInfo = ({ profile, identity, posts, reloadProfile }: ProfileProps) => {

    const classes = headerStyles();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [totalLikes, setTotalLikes] = useState(0);

    const handleProfileLikes = async (postList: Array<String>) => {
        let likes = await getProfileLikes(postList);
        setTotalLikes(likes);
    }

    useEffect(() => {
        handleProfileLikes(posts.map(post => post.video_id[0]));
    }, [posts]);

    const openEditDialog = () => {
        setEditDialogOpen(true);
    };

    const closeEditDialog = (reloadNeccesary: boolean) => {
        if (reloadNeccesary) {
            reloadProfile();
        }
        setEditDialogOpen(false);
    }

    return (
        <Grid container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
            className={classes.wrapper}
        >
            <Grid item>
                <EditProfileDialog open={editDialogOpen} handleClose={closeEditDialog} />
                <Button variant="contained" onClick={openEditDialog}>Edit</Button>
            </Grid>

            <Grid item>
                <Paper className={classes.paper}>
                    <ProfileIcon />
                </Paper>
            </Grid>

            <Grid item>
                <Box className={classes.profile_likes}>
                    <FavoriteBorderIcon />
                    <Typography variant="body1">{totalLikes}</Typography>
                </Box>
            </Grid>

            <Grid item>
                <ProfileId id={profile?.principal.toText() || "<<id>>"} />
            </Grid>

            <Grid item>
                <Typography variant="h5" align="center">
                    <b>{profile?.name || "<<name>>"}</b>
                </Typography>
            </Grid>

            <Grid item>
                <BioBox bio={profile?.bio || "<<bio>>"} />
            </Grid>

        </Grid>
    );
}

export default ProfileInfo;