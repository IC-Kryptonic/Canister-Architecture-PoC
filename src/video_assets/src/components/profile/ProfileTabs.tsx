import React, { useState, useEffect } from "react";
import { useProfileTabsStyles } from "../../styles/profile_styles";
import { Divider, Tabs, Tab, Hidden, Typography } from "@material-ui/core";

import AppsIcon from '@material-ui/icons/Apps';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import VideocamIcon from '@material-ui/icons/Videocam';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import GridPost from "../shared/GridPost";
import { Profile } from "../../interfaces/profile_interface";
import { Post } from "../../interfaces/video_interface";
import { loadOwnerFeed } from '../../services/video_backend';

interface ProfileTabsInterface {
    profile: Profile,
    isOwner: Boolean
}

function ProfileTabs({ profile, isOwner }: ProfileTabsInterface) {
    const classes = useProfileTabsStyles();
    const [value, setValue] = useState(0);

    const [profilePosts, setProfilePosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);

    const handleProfilePosts= async () => {
        let profilePosts = await loadOwnerFeed(profile.principal);
        setProfilePosts(profilePosts);
    }

    const handleLikedPosts= async () => {
        let likedPosts = await loadOwnerFeed(profile.principal);
        setLikedPosts(likedPosts);
    }

    useEffect(() => {
        handleProfilePosts();
        //handleLikedPosts();
    }, []);

    return (
        <>
            <section className={classes.section}>
                <Hidden xsDown>
                    <Divider />
                </Hidden>
                <Hidden xsDown>
                    <Tabs
                        value={value}
                        onChange={(_, value) => setValue(value)}
                        centered
                        classes={{ indicator: classes.tabsIndicator }}
                    >
                        <Tab
                            icon={(<AppsIcon />)}
                            label="POSTS"
                            classes={{
                                root: classes.tabRoot,
                                labelIcon: classes.tabLabelIcon,
                                wrapper: classes.tabWrapper,
                            }}
                        />
                        {isOwner && (
                            <Tab
                                icon={<BookmarkIcon />}
                                label="SAVED"
                                classes={{
                                    root: classes.tabRoot,
                                    labelIcon: classes.tabLabelIcon,
                                    wrapper: classes.tabWrapper,
                                }}
                            />
                        )}
                    </Tabs>
                </Hidden>
                <Hidden smUp>
                    <Tabs
                        value={value}
                        onChange={(_, value) => setValue(value)}
                        centered
                        className={classes.tabs}
                        classes={{ indicator: classes.tabsIndicator }}
                    >
                        <Tab
                            icon={<AppsIcon />}
                            classes={{ root: classes.tabRoot }}
                        />
                        {isOwner && (
                            <Tab
                                icon={<BookmarkIcon />}
                                classes={{ root: classes.tabRoot }}
                            />
                        )}
                    </Tabs>
                </Hidden>
                <Hidden smUp>{profile.likes.length === 0 && <Divider />}</Hidden>
                {value === 0 && <ProfilePosts profile={profile} isOwner={isOwner} profilePosts={profilePosts} />}
                {value === 1 && <SavedPosts profile={profile} likedPosts={likedPosts} />}
            </section>
        </>
    );
}

interface ProfilePostsInterface {
    profile: Profile,
    isOwner: Boolean,
    profilePosts: Post[]
}

function ProfilePosts({ profile, isOwner, profilePosts }: ProfilePostsInterface) {
    const classes = useProfileTabsStyles();

    if (profilePosts.length === 0) {
        return (
            <section className={classes.profilePostsSection}>
                <div className={classes.noContent}>
                    <VideocamIcon />
                    <Typography variant="h4">
                        {isOwner ? "Upload a Video" : "No Videos"}
                    </Typography>
                </div>
            </section>
        );
    }

    return (
        <article className={classes.article}>
            <div className={classes.postContainer}>
                {profilePosts.map((post) => (
                    <GridPost key={post.video_id} post={post} />
                ))}
            </div>
        </article>
    );
}

interface LikedPostsInterface {
    profile: Profile,
    likedPosts: Post[]
}

function SavedPosts({ profile, likedPosts }: LikedPostsInterface) {
  const classes = useProfileTabsStyles();

  if (likedPosts.length === 0) {
    return (
      <section className={classes.savedPostsSection}>
        <div className={classes.noContent}>
          <FavoriteBorderIcon />
          <Typography variant="h4">Like</Typography>
          <Typography align="center">
            Like videos that you and others want to see again.
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {likedPosts.map((post) => (
          <GridPost key={post.video_id} post={post} />
        ))}
      </div>
    </article>
  );
}

export default ProfileTabs;
