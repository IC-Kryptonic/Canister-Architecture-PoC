import React, { useState } from "react";
import { Box, Grid, Paper, makeStyles, Button } from "@material-ui/core"
import { Profile } from "../../interfaces/profile_interface";
import { Identity } from '@dfinity/agent';

import ProfileIcon from "./ProfileIcon";
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
    }
});

const ProfileInfo = ({ profile, identity, reloadProfile }: ProfileProps) => {

    const classes = headerStyles();

    const [editDialogOpen, setEditDialogOpen] = useState(false);

    let profileId = profile ? profile.principal.toText() : "123456";
    let profileName = profile ? profile.name : "Unknown";

    const openEditDialog = () => {
        setEditDialogOpen(true);
    };

    const closeEditDialog = (reloadNeccesary: boolean) => {
        if(reloadNeccesary) {
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
                <Paper className={classes.paper}>
                    {profileName}
                </Paper>
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