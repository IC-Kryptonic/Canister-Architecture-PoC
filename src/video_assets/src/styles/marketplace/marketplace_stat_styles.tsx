import { makeStyles } from '@material-ui/core';

const marketplaceStatStyles = makeStyles({
  card: {
    marginTop: 10,
    marginBottom: 10,
  },
  container: {
    padding: '1rem',
    width: 340,
    height: 120,
  },
  title: {
    color: 'grey',
    fontWeight: 200,
  },
  footer: {
    fontWeight: 200,
    marginTop: 20,
  },
  footerHighlight: {
    color: '#3bb845',
    marginRight: 5,
  },
  value: {
    marginTop: 5,
    fontSize: 22,
    fontWeight: 300,
  },
});

export { marketplaceStatStyles };
