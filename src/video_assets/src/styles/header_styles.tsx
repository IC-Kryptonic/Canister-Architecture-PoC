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
});

export { headerStyles };
