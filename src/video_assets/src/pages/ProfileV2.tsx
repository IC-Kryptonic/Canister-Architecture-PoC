import React, { useState, useEffect } from "react";
import { useProfilePageStyles } from "../styles/profile_styles";
import Layout from "../components/shared/Layout";
import LoadingScreen from "../components/shared/LoadingScreen";
import ProfilePicture from "../components/profile/ProfilePicture";
import { Profile } from '../interfaces/profile_interface';
import { loadProfile } from '../services/profile_service';
import { getAuthenticatedIdentity } from '../services/auth_services';
import {
  Hidden,
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  Zoom,
  Divider,
  DialogTitle,
  Avatar,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileTabs from "../components/profile/ProfileTabs";
import EditProfileDialog from "../components/profile/EditProfileDialog";
//import ProfileTabs from "../components/profile/ProfileTabs";
//import { AuthContext } from "../auth";
//import LoadingScreen from "../components/shared/LoadingScreen";
// import { UserContext } from "../App";

function ProfilePage() {

  //const { username } = useParams();
  //const { currentUserId } = React.useContext(UserContext);
  //const classes = useProfilePageStyles();
  //const [showOptionsMenu, setOptionsMenu] = React.useState(false);

  /*
  const [user] = data.users;
  
 
  function handleOptionsMenuClick() {
    setOptionsMenu(true);
  }
 
  function handleCloseMenu() {
    setOptionsMenu(false);
  }
*/
  const classes = useProfilePageStyles();

  const [profile, setProfile] = useState<Profile | null>(null);

  // Define update hook
  const handleProfile = async () => {
    // TODO: Add path variable to which profile is loaded
    let profile = await loadProfile();
    setProfile(profile);
  }

  React.useEffect(() => {
    handleProfile();
  }, []);

  const reloadProfile = () => {
    setProfile(null);
    handleProfile();
  }

  // if profile is still loading
  if (!profile) return <LoadingScreen />;

  const isOwner = true;
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
  profile: Profile,
  isOwner: Boolean,
  handleOptionsMenuClick?: () => void,
  reloadProfile: () => void
}

function ProfileNameSection({ profile, isOwner, handleOptionsMenuClick, reloadProfile }: ProfileNameSectionInterface) {
  const classes = useProfilePageStyles();
  const [showUnfollowDialog, setUnfollowDialog] = React.useState(false);
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
  // const { currentUserId, followingIds, followerIds } = React.useContext(
  //   UserContext
  // );
  // const isAlreadyFollowing = followingIds.some((id) => id === user.id);
  // const [isFollowing, setFollowing] = React.useState(isAlreadyFollowing);
  // const isFollower = !isFollowing && followerIds.some((id) => id === user.id);
  // const variables = {
  //   userIdToFollow: user.id,
  //   currentUserId,
  // };
  // const [followUser] = useMutation(FOLLOW_USER);

  // function handleFollowUser() {
  //   setFollowing(true);
  //   followUser({ variables });
  // }

  // const onUnfollowUser = React.useCallback(() => {
  //   setUnfollowDialog(false);
  //   setFollowing(false);
  // }, []);

  // let followButton;
  // // const isFollowing = true;
  // if (isFollowing) {
  //   followButton = (
  //     <Button
  //       onClick={() => setUnfollowDialog(true)}
  //       variant="outlined"
  //       className={classes.button}
  //     >
  //       Following
  //     </Button>
  //   );
  // } else if (isFollower) {
  //   followButton = (
  //     <Button
  //       onClick={handleFollowUser}
  //       variant="contained"
  //       color="primary"
  //       className={classes.button}
  //     >
  //       Follow Back
  //     </Button>
  //   );
  // } else {
  //   followButton = (
  //     <Button
  //       onClick={handleFollowUser}
  //       variant="contained"
  //       color="primary"
  //       className={classes.button}
  //     >
  //       Follow
  //     </Button>
  //   );
  // }

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
                Edit Profile
              </Button>
              <div
                onClick={handleOptionsMenuClick}
                className={classes.settingsWrapper}
              >
                <SettingsIcon className={classes.settings} />
              </div>
            </>
          ) : (
            <><SettingsIcon /></>
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
            <SettingsIcon />
          )}
        </section>
      </Hidden>
      <EditProfileDialog open={editProfileDialogOpen} handleClose={closeProfileEditDialog} />
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
  profile: Profile
}

function PostCountSection({ profile }: ProfilePropInterface) {
  const classes = useProfilePageStyles();
  const options = ["posts", "followers", "following"];

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        {options.map((option) => (
          <div key={option} className={classes.followingText}>
            <Typography className={classes.followingCount}>
              {/* {user[`${option}_aggregate`].aggregate.count} */}
              1
            </Typography>
            <Hidden xsDown>
              <Typography>{option}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography color="textSecondary">{option}</Typography>
            </Hidden>
          </div>
        ))}
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
      <Typography className={classes.typography}>{profile.name}</Typography>
      <Typography>{profile.bio}</Typography>
      {/* <a href={user.website} target="_blank" rel="noopener noreferrer">
        <Typography color="secondary" className={classes.typography}>
          {user.website}
        </Typography>
      </a> */}
    </section>
  );
}

export default ProfilePage;