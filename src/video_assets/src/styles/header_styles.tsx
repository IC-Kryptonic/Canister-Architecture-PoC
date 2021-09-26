import { makeStyles } from '@material-ui/core';

const borderBottom = '1px solid #e6e7e9';

const headerStyles = makeStyles({
  outerHeaderContainer: {
    padding: 10,
    marginBottom: 20,
    borderBottom: borderBottom,
  },
  innerHeaderContainer: {
    maxWidth: 1280,
  },
  logo: {
    height: 20,
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
});

export { headerStyles };
