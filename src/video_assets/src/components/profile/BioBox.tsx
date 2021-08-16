import React from "react";
import { Typography, Box, makeStyles, Divider } from "@material-ui/core"

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

interface BioProps {
    bio: string;
}

const BioBox = ({ bio }: BioProps) => {

    const classes = headerStyles();

    return (
        <Box>
            <Typography variant="subtitle1" align="left">
                <b>Bio</b>
            </Typography>
            <Divider />
            <Typography variant="caption" align="left">
                {bio}
            </Typography>
        </Box>
    );
}

export default BioBox;