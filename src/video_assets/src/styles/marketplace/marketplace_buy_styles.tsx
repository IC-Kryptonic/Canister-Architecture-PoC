import { makeStyles } from '@material-ui/core';

const useMarketplaceBuyStyles = makeStyles({
  title: { marginTop: 40, fontSize: 32 },
  subtitle: { marginBottom: 30, fontWeight: 300, fontSize: 22, color: 'grey' },
  outerContainer: { marginTop: 10 },
  paper: { padding: 30 },
  paperContainer: { width: 500 },
  priceInput: {
    width: '100%',
    marginTop: 5,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    borderRadius: 4,
    borderColor: 'rgb(204, 204, 204)',
    padding: 5,
    height: 41.5,
  },
  priceInDollar: { fontSize: 16 },
  button: { width: 150 },
});

export { useMarketplaceBuyStyles };
