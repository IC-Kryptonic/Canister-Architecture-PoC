import React from "react";
import { Box, makeStyles } from "@material-ui/core"

import AccountCircle from '@material-ui/icons/AccountCircle';

const headerStyles = makeStyles({
    profile_logo_wrapper: {
        borderRadius: "50%",
        backgroundColor: "white"
    },
    profile_logo: {
        width: 100,
        height: 100,
    }
});

const ProfileIcon = () => {

    const classes = headerStyles();

    return (
        <Box className={classes.profile_logo_wrapper}>
            <AccountCircle className={classes.profile_logo}/>
        </Box>
    );
}

export default ProfileIcon;