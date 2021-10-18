import { makeStyles } from '@material-ui/core';

const useCurrencySwitchStyles = makeStyles({
  paper: { padding: 10, backgroundColor: '#14212c' },
  unselectedCard: {
    width: 100,
    border: 0,
    cursor: 'pointer',
    color: 'white',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  selectedCard: { width: 100, cursor: 'pointer' },
  text: { padding: 5 },
  logo: { paddingTop: 6 },
});

export { useCurrencySwitchStyles };
