import React, { useState, useEffect } from 'react';
import { Box, Paper, makeStyles } from '@material-ui/core';
import { Identity } from '@dfinity/agent';
import Header from '../components/Header';
import { loadProfile } from '../services/profile_service';
import { loadOwnerFeed } from '../services/video_backend';

import { Profile } from '../interfaces/profile_interface';
import ProfileInfo from '../components/profile/ProfileInfo';
import { getAuthenticatedIdentity } from '../services/auth_services';
import VideoBox from '../components/profile/VideoBox';

const profileStyles = makeStyles({
  content_wrapper: {
    display: "flex",
    flexWrap: "wrap",
    margin: 40
  },
  left_wrapper: {
    margin: 20
  },
  right_wrapper: {
    marign: 50,
    minWidth: 600,
    maxWidth: 800
  },
  paper: {
    margin: 50,
    maxWidth: 500,
  }
});

const Profile = () => {

  const classes = profileStyles();

  const [identity, setIdentity] = useState<Identity | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState([]);

  const handleProfile = async () => {
    let identity = await getAuthenticatedIdentity();
    setIdentity(identity);

    let profile = await loadProfile();
    setProfile(profile);

    let posts = await loadOwnerFeed(identity.getPrincipal());
    setPosts(posts);
  }

  useEffect(() => {
    handleProfile();
  }, []);

  const reloadProfile = () => {
    handleProfile();
  }

  return (
    <>
      <Header />
      <Box className={classes.content_wrapper}>
        <Box className={classes.paper}>
          <ProfileInfo profile={profile} identity={identity} reloadProfile={reloadProfile} posts={posts}/>
        </Box>
        <Box className={classes.right_wrapper}>
          <VideoBox posts={posts} />
        </Box>
      </Box>
    </>
  );
};

export default Profile;
