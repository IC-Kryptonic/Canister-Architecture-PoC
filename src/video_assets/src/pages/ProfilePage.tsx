import React, { useState, useEffect } from "react";
import { useProfilePageStyles } from "../styles/profile_styles";
import Layout from "../components/shared/Layout";
import LoadingScreen from "../components/shared/LoadingScreen";
import ProfilePicture from "../components/profile/ProfilePicture";
import { Profile } from '../interfaces/profile_interface';
import { loadProfile, getProfile } from '../services/profile_service';
import { getAuthenticatedIdentity } from '../services/auth_services';
import {
  Hidden,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileTabs from "../components/profile/ProfileTabs";
import EditProfileDialog from "../components/profile/EditProfileDialog";
import { Principal } from "@dfinity/principal";
//import ProfileTabs from "../components/profile/ProfileTabs";
//import { AuthContext } from "../auth";
//import LoadingScreen from "../components/shared/LoadingScreen";
// import { UserContext } from "../App";

interface ProfilePagePathParam {
  id: string
}

function ProfilePage() {
  //const [showOptionsMenu, setOptionsMenu] = React.useState(false);

  /* 
  function handleOptionsMenuClick() {
    setOptionsMenu(true);
  }
 
  function handleCloseMenu() {
    setOptionsMenu(false);
  }
*/
  const classes = useProfilePageStyles();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [profileFound, setProfileFound] = useState(true);

  let { id }: ProfilePagePathParam = useParams();

  // Define update hook
  const handleProfile = async () => {
    let identity = await getAuthenticatedIdentity();
    let principal = identity.getPrincipal().toText();
    // If there is no id load our profile or if the id is our profile
    if (!id || id && principal === id) {
      let profile = await loadProfile();
      setProfile(profile);
      setIsOwner(true);
      setProfileFound(true);
    } else {
      // Try to find user based on id
      try {
        let principal = Principal.fromText(id);
        let profile = await getProfile(principal);

        if (!profile) {
          setProfileFound(false);
        }
  
        setProfile(profile);
        setIsOwner(false);
        setProfileFound(true);

      } catch(error) {
        console.log(error);
        setProfileFound(false);
      }
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
  if (!profile) return <LoadingScreen />;


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