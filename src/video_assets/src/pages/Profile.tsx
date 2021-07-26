import React, { useState, useEffect } from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import { Identity } from '@dfinity/agent';
import Header from '../components/Header';
import { loadProfile } from '../services/profile_service';

import { Profile } from '../interfaces/profile_interface';
import ProfileInfo from '../components/profile/ProfileInfo';
import { getAuthenticatedIdentity } from '../services/auth_services';
import VideoList from '../components/profile/VideoList';

const profileStyles = makeStyles({
  grid_wrapper: {
    margin: 20
  },
  paper: {
    minWidth: 400,
    minHeight: 800
  }
});

const Profile = () => {

  const classes = profileStyles();

  const [identity, setIdentity] = useState<Identity | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleProfile = async () => {
    let identity = await getAuthenticatedIdentity();
    setIdentity(identity);

    let profile = await loadProfile();
    setProfile(profile);
  }

  useEffect(() => {
    handleProfile();
  }, []);



  return (
    <>
      <Header />
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
        className={classes.grid_wrapper}
      >
        <Grid item xs={4}>
          <Paper className={classes.paper}>
            <ProfileInfo profile={profile} identity={identity}/>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <VideoList />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
