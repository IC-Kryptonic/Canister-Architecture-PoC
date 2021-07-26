import React from "react";
import { Box, Grid, Paper, makeStyles } from "@material-ui/core"
import { Profile } from "../../interfaces/profile_interface";
import { Identity } from '@dfinity/agent';

import AccountCircle from '@material-ui/icons/AccountCircle';

interface ProfileProps {
    profile: Profile;
    identity: Identity;
}

const headerStyles = makeStyles({
    profile_logo: {
        width: 100,
        height: 100,
    }
});

const ProfileInfo = ({ profile, identity }: ProfileProps) => {

    const classes = headerStyles();

    let profileId = profile ? profile.principal.toText() : "123456";
    let profileName = profile ? profile.name : "Unknown";

    return (
        <Grid container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
        >
            <Grid item>
                <Paper>
                    <AccountCircle className={classes.profile_logo} />
                </Paper>
            </Grid>

            <Grid item>
                <Paper>
                    {profileId}
                </Paper>
            </Grid>

            <Grid item>
                <Paper>
                    {profileName}
                </Paper>
            </Grid>

            <Grid item>
                <Paper>
                    Description box
                </Paper>
            </Grid>

        </Grid>
    );
}

export default ProfileInfo;