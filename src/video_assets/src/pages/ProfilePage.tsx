import React, { useState, useEffect } from "react";
import { useProfilePageStyles } from "../styles/profile_styles";
import Layout from "../components/shared/Layout";
import LoadingScreen from "../components/shared/LoadingScreen";
import ProfilePicture from "../components/profile/ProfilePicture";
import { LazyProfilePost } from '../interfaces/profile_interface';
import { getLazyMyProfile, getLazyUserProfile } from '../services/profile_backend';
import { getAuthenticatedIdentity } from '../services/auth_services';
import {
  Hidden,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Box,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileTabs from "../components/profile/ProfileTabs";
// import EditProfileDialog from "../components/profile/EditProfileDialog";
import { Principal } from "@dfinity/principal";

interface ProfilePagePathParam {
  id: string
}

function ProfilePage() {
  const classes = useProfilePageStyles();
  const [profile, setProfile] = useState<LazyProfilePost | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [profileFound, setProfileFound] = useState(true);

  let { id }: ProfilePagePathParam = useParams();

  // Define update hook
  const handleProfile = async () => {
    let identity = await getAuthenticatedIdentity();
    let principal = identity.getPrincipal().toText();

    // Try to parse principal from id
    let principalProfile;
    if (id) {
      try {
        principalProfile = Principal.fromText(id);
      } catch (error) {
        console.log(error);
        setProfileFound(false);
      }
    }
    // If there is no id load our profile or if the id is our profile
    if (!id || principal === principalProfile.toText()) {
      let profile = await getLazyMyProfile();
      setProfile(profile);
      setIsOwner(true);
      setProfileFound(true);
    } else {
      // Try to find user based on id
      let profile = await getLazyUserProfile(principalProfile);

      if (!profile) {
        setProfileFound(false);
      }

      setProfile(profile);
      setIsOwner(false);
      setProfileFound(true);
    }
  }

  useEffect(() => {
    handleProfile();
  }, []);

  const reloadProfile = () => {
    setProfile(null);
    handleProfile();
  }

  if (!profileFound) return <> Could not find profile </>;

  // if profile is still loading
  if (!profile) return (
    <Layout title={"Profile"} marginTop={20}>
      <span>Profile loading...</span>
    </Layout>
  );


  function handleOptionsMenuClick() {

  }

  return (
    <Layout title={profile.name}>
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection
                profile={profile}
                isOwner={isOwner}
                reloadProfile={reloadProfile}
              />
              <PostCountSection profile={profile} />
              <NameBioSection profile={profile} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture
                  size={77}
                  isOwner={isOwner}
                />
                <ProfileNameSection
                  profile={profile}
                  isOwner={isOwner}
                  reloadProfile={reloadProfile}
                />
              </section>
              <NameBioSection profile={profile} />
            </CardContent>
            <PostCountSection profile={profile} />
          </Card>
        </Hidden>
        {/* {showOptionsMenu && <OptionsMenu handleCloseMenu={handleCloseMenu} />} */}
        <ProfileTabs profile={profile} isOwner={isOwner} />
      </div>
    </Layout>
  );
}

interface ProfileNameSectionInterface {
  profile: LazyProfilePost,
  isOwner: Boolean,
  handleOptionsMenuClick?: () => void,
  reloadProfile: () => void
}

function ProfileNameSection({ profile, isOwner, handleOptionsMenuClick, reloadProfile }: ProfileNameSectionInterface) {
  const classes = useProfilePageStyles();
  const [showUnfollowDialog, setUnfollowDialog] = React.useState(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);

  const closeProfileEditDialog = (reloadNeccesary: boolean) => {
    if (reloadNeccesary) {
      reloadProfile();
    }
    setEditProfileDialogOpen(false);
  }

  return (
    <>
      <Hidden xsDown>
        <section className={classes.usernameSection}>
          <Typography className={classes.username}>{profile.name}</Typography>
          {isOwner ? (
            <>
              <Button variant="outlined" style={{ width: "100%" }} onClick={() => setEditProfileDialogOpen(true)} >
                <Typography variant="caption">Edit Profile</Typography>
              </Button>
              <div
                onClick={handleOptionsMenuClick}
                className={classes.settingsWrapper}
              >
                <SettingsIcon className={classes.settings} />
              </div>
            </>
          ) : (
            <></>
          )}
        </section>
      </Hidden>
      <Hidden smUp>
        <section>
          <div className={classes.usernameDivSmall}>
            <Typography className={classes.username}>
              {profile.name}
            </Typography>
            {isOwner && (
              <div
                onClick={handleOptionsMenuClick}
                className={classes.settingsWrapper}
              >
                <SettingsIcon className={classes.settings} />
              </div>
            )}
          </div>
          {isOwner ? (
            <Button variant="outlined" style={{ width: "100%" }} onClick={() => setEditProfileDialogOpen(true)} >
              Edit Profile
            </Button>
          ) : (
            <></>
          )}
        </section>
      </Hidden>
      {/* <EditProfileDialog open={editProfileDialogOpen} handleClose={closeProfileEditDialog} /> */}
      {/* {showUnfollowDialog && (
          <UnfollowDialog
            onUnfollowUser={onUnfollowUser}
            user={user}
            onClose={() => setUnfollowDialog(false)}
          />
        )} */}
    </>
  );
}

interface ProfilePropInterface {
  profile: LazyProfilePost
}

function PostCountSection({ profile }: ProfilePropInterface) {
  const classes = useProfilePageStyles();
  const options = ["posts", "followers", "follows"];

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        <div key={"posts"} className={classes.followingText}>
          <Typography className={classes.followingCount}>
            {/* {user[`${option}_aggregate`].aggregate.count} */}
            {1}
          </Typography>
          <Hidden xsDown>
            <Typography>followers</Typography>
          </Hidden>
          <Hidden smUp>
            <Typography color="textSecondary">followers</Typography>
          </Hidden>
        </div>
        <div key={"followers"} className={classes.followingText}>
          <Typography className={classes.followingCount}>
            {1}
            {/* {profile.followers.length} */}
          </Typography>
          <Hidden xsDown>
            <Typography>followers</Typography>
          </Hidden>
          <Hidden smUp>
            <Typography color="textSecondary">followers</Typography>
          </Hidden>
        </div>
        <div key={"follows"} className={classes.followingText}>
          <Typography className={classes.followingCount}>
            {1}
            {/* {profile.followers.length} */}
          </Typography>
          <Hidden xsDown>
            <Typography>follows</Typography>
          </Hidden>
          <Hidden smUp>
            <Typography color="textSecondary">follows</Typography>
          </Hidden>
        </div>
      </section>
      <Hidden smUp>
        <Divider />
      </Hidden>
    </>
  );
}

function NameBioSection({ profile }: ProfilePropInterface) {
  const classes = useProfilePageStyles();

  return (
    <section className={classes.section}>
      <Typography className={classes.typography}>{profile.principal.toText()}</Typography>
      {/* <Typography>{profile.bio}</Typography> */}
    </section>
  );
}

export default ProfilePage;