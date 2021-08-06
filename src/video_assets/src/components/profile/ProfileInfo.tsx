import React, { useState } from "react";
import { Box, Grid, Paper, makeStyles, Button, Typography } from "@material-ui/core"
import { Profile } from "../../interfaces/profile_interface";
import { Identity } from '@dfinity/agent';

import ProfileIcon from "./ProfileIcon";
import ProfileId from "./ProfileId";
import EditProfileDialog from "./EditProfileDialog";

interface ProfileProps {
    profile: Profile;
    identity: Identity;
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
    }
});

const ProfileInfo = ({ profile, identity, reloadProfile }: ProfileProps) => {

    const classes = headerStyles();

    const [editDialogOpen, setEditDialogOpen] = useState(false);

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
            justify="flex-start"
            alignItems="flex-start"
            spacing={2}
            className={classes.wrapper}
        >
            <Grid item>
                <Paper className={classes.paper}>
                    <ProfileIcon />
                </Paper>
            </Grid>

            <Grid item>
                <EditProfileDialog open={editDialogOpen} handleClose={closeEditDialog} />
                <Button variant="contained" onClick={openEditDialog}>Edit</Button>
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
                <Paper className={classes.paper}>
                    Bio
                </Paper>
            </Grid>

            <Grid item>
                <Paper className={classes.paper}>
                    Links
                </Paper>
            </Grid>

            <Grid item>
                <Paper className={classes.paper}>
                    Joined ...
                </Paper>
            </Grid>

        </Grid>
    );
}

export default ProfileInfo;