import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Header from '../components/Header';
import PostComponent from '../components/Post';
import { loadDefaultFeed } from '../services/video_backend';
import { Post } from '../interfaces/video_interface';

const Profile = () => {
  const [profile, setProfile] = useState<Array<Post>>([]);

  useEffect(() => {
    console.info("Profile view initialized!");
  }, []);

  return (
    <>
      <Header />
    </>
  );
};

export default Profile;
