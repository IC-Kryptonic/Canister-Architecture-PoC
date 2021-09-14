import { makeStyles } from '@material-ui/core';

const marketplaceDashboardStyles = makeStyles({
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#EAEBED',
    zIndex: -1,
  },
  cards: { maxWidth: 1280, marginTop: '2%' },
  factTitle: {
    color: 'grey',
    fontWeight: 300,
  },
  factValue: {
    fontWeight: 400,
    marginBottom: 15,
  },
});

export { marketplaceDashboardStyles };
