import { makeStyles } from '@material-ui/core';

export const useSidebarStyles = makeStyles({
  background: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: 240,
    backgroundColor: 'white',
    zIndex: 10,
  },
  container: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: 240,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 11,
  },
  bottomContainer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: 240,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    zIndex: 11,
  },
  bottomDivider: {
    marginBottom: 20,
  },
  blackAndWhiteLogo: {
    webkitFilter: 'grayscale(100%)',
    filter: 'grayscale(100%)',
    height: 20,
  },
  logo: {
    height: 50,
  },
  logoWrapper: {
    padding: 10,
    marginTop: 30,
    marginLeft: 15,
  },
  brandText: {
    marginTop: 20,
    paddingLeft: 20,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
  },
});
