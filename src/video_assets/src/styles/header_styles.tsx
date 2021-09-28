import { makeStyles } from '@material-ui/core';

import { PurpleColor } from './shared_styles';

const borderBottom = '1px solid #e6e7e9';

const headerStyles = makeStyles({
  container: {
    maxHeight: '15vh',
    //borderBottom: `1px solid ${PurpleColor}`
    backgroundColor: "white"
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
    padding: 0
  },
  icon_color: {
    color: PurpleColor
  },
  profile: {
    width: 40,
    height: 40,
    color: PurpleColor
  },
  textButton: {
    width: 150,
    fontWeight: 350,
  },
  textButtonSmall: {
    width: 100,
    fontWeight: 350,
  },
  textButtonActive: {
    borderBottom: borderBottom,
    width: 150,
    fontWeight: 400,
  },
  textButtonSmallActive: {
    borderBottom: borderBottom,
    width: 100,
    fontWeight: 400,
  },
  icpButton: {
    marginRight: 20
  }
});

export { headerStyles };
