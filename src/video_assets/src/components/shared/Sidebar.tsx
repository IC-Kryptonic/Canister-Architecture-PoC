import { Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useSidebarStyles } from '../../styles/sidebar_styles';
import logo from '../../assets/images/kryptonic_logo.png';
import iiLogo from '../../assets/images/internet_identity_logo.svg';
import extLogo from '../../assets/images/ext_logo.png';
import NavItemButtons from './NavItemButtons';

export enum SidebarType {
  PLATFORM,
  MARKETPLACE,
}

interface SidebarProps {
  type: SidebarType;
}

const Sidebar = (props: SidebarProps) => {
  const classes = useSidebarStyles();
  return (
    <>
      <div className={classes.background}></div>
      <Grid container justify="flex-start" className={classes.container} spacing={1}>
        <Grid item xs={12} className={classes.logoWrapper}>
          <img className={classes.logo} src={logo} alt="logo" />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.brandText}>
            The Decentralized Content Platform for the Internet of Value
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <NavItemButtons forMarketplace={props.type === SidebarType.MARKETPLACE} />
      </Grid>
      <Grid container justify="space-around" className={classes.bottomContainer} spacing={1}>
        <Grid item xs={12}>
          <Divider className={classes.bottomDivider} />
        </Grid>
        <Grid item>
          <img className={classes.blackAndWhiteLogo} src={logo} alt="logo" />
        </Grid>
        <Grid item>
          <img className={classes.blackAndWhiteLogo} src={iiLogo} alt="logo" />
        </Grid>
        <Grid item>
          <img className={classes.blackAndWhiteLogo} src={extLogo} alt="logo" />
        </Grid>
      </Grid>
    </>
  );
};

export default Sidebar;
