import { makeStyles } from '@material-ui/core';

import { DarkGreyColor, LightGreyColor, PurpleColor } from './shared_styles';

const borderBottom = `2px solid ${DarkGreyColor}`;

const headerStyles = makeStyles({
  container: {
    minHeight: 60,
    maxHeight: '15vh',
    maxWidth: 1280,
    backgroundColor: 'white',
  },
  logo_wrapper: {
    padding: 10,
    marginLeft: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
  },
  logo: {
    height: 40,
  },
  logo_button: {
    marginTop: 0,
    padding: 0,
  },
  icon_color: {
    color: PurpleColor,
  },
  profile: {
    width: 40,
    height: 40,
    color: PurpleColor,
  },
  textButton: {
    borderRadius: 0,
    width: 150,
    fontWeight: 350,
    color: LightGreyColor,
  },
  textButtonActive: {
    borderRadius: 0,
    borderBottom: borderBottom,
    width: 150,
    fontWeight: 400,
    color: DarkGreyColor,
  },
  icpButton: {
    marginRight: 20,
  },
});

export { headerStyles };
