import { makeStyles } from '@material-ui/core';

const headerStyles = makeStyles({
  outerHeaderContainer: {
    padding: 10,
    borderBottom: 'solid 1px rgb(227, 227, 228)',
    marginBottom: 20,
  },
  innerHeaderContainer: {
    maxWidth: 1280,
  },
  logo: {
    height: 20,
  },
  textButton: {
    color: 'white',
    width: 150,
    fontWeight: 350,
  },
  textButtonSmall: {
    color: 'white',
    width: 100,
    fontWeight: 350,
  },
  textButtonActive: {
    color: 'white',
    borderBottom: '1px solid #FFFFFF',
    width: 150,
    fontWeight: 400,
  },
  textButtonSmallActive: {
    color: 'white',
    borderBottom: '1px solid #FFFFFF',
    width: 100,
    fontWeight: 400,
  },
});

export { headerStyles };
