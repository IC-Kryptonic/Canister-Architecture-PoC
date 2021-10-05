import React from "react";
import { Grid, Box, makeStyles } from "@material-ui/core"

const headerStyles = makeStyles({
    id_box: {
        borderRadius: "10px",
        padding: "5px",
        color: "white",
        backgroundColor: "black"
    },
    principal_box: {
        padding: "5px"
    },
    wrapper: {
        borderRadius: "10px",
        backgroundColor: "#D3D3D3"
    }
});

interface IdProps {
    id: string;
}

const ProfileId = (props: IdProps) => {

    const classes = headerStyles();

    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={0}
            className={classes.wrapper}
        >
            <Grid item>
                <Box className={classes.id_box}>
                    <i>#ID</i>
                </Box>
            </Grid>
            <Grid item>
                <Box className={classes.principal_box}>
                    {props.id} 
                </Box>
            </Grid>
        </Grid>

    );
}

export default ProfileId;