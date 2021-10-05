import React from "react";
import { useProfilePictureStyles } from "../../styles/profile_styles";
import { Person } from "@material-ui/icons";

interface ProfilePictureInterface {
    size?: number,
    image?: string,
    isOwner: Boolean
}

// TODO: Add ProfilePicture update
function ProfilePicture({ size, image, isOwner }: ProfilePictureInterface) {
    const classes = useProfilePictureStyles({ size, isOwner });

    return (
        <section className={classes.section}>
            <div className={classes.wrapper}>
                <Person className={classes.person} />
            </div>
        </section>
    );
}

export default ProfilePicture;
