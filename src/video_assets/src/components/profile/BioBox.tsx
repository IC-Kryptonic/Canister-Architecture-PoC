import React from "react";
import { Typography, Box, makeStyles, Divider } from "@material-ui/core"

interface BioProps {
    bio: string;
}

const BioBox = ({ bio }: BioProps) => {

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