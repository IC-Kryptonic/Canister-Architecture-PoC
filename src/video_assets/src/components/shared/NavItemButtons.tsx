import { Button, Grid, SvgIconTypeMap, Typography } from '@material-ui/core';
import React from 'react';
import { useSidebarStyles } from '../../styles/sidebar_styles';
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { useLocation } from 'react-router';
import history from '../History';

function isActive(name: string, location: string) {
  return location.toLocaleLowerCase().includes(name.toLocaleLowerCase());
}
interface NavItem {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  location: string;
}

const marketplaceItems: Array<NavItem> = [
  { label: 'Markets', icon: CompareArrowsIcon, location: '/marketplace/markets' },
  { label: 'Dashboard', icon: TrendingUpOutlinedIcon, location: '/marketplace/dashboard' },
  { label: 'Faucet', icon: AddIcon, location: '/marketplace/faucet' },
  { label: 'Governance', icon: RecordVoiceOverIcon, location: '/marketplace/markets' },
];

const platformItems: Array<NavItem> = [
  { label: 'Home', icon: OndemandVideoIcon, location: '/home' },
  { label: 'Upload', icon: CloudUploadIcon, location: '/upload' },
  { label: 'Profile', icon: RecordVoiceOverIcon, location: '/profile' },
];

const NavItemButtons = ({ forMarketplace }: { forMarketplace: boolean }) => {
  const classes = useSidebarStyles();
  const location = useLocation();
  const items = forMarketplace ? marketplaceItems : platformItems;

  return (
    <>
      {items.map((navItem: NavItem) => {
        const color = isActive(navItem.label, location.pathname) ? 'primary' : 'secondary';
        return (
          <Grid item xs={12} key={navItem.label}>
            <Button
              className={classes.button}
              onClick={() => {
                history.push(navItem.location);
              }}
            >
              <Grid container justify="flex-start" spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <navItem.icon color={color} />
                </Grid>
                <Grid item>
                  <Typography color={color}>{navItem.label}</Typography>
                </Grid>
              </Grid>
            </Button>
          </Grid>
        );
      })}
    </>
  );
};

export default NavItemButtons;
