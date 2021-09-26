import { makeStyles } from '@material-ui/core';

const marketplaceHomeStyles = makeStyles({
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
  table: { width: '100%', maxWidth: 1280, marginTop: '4%' },
  tableContent: { width: '100%', maxWidth: 1280, marginTop: 15 },
  thumbnail: { height: 80 },
  tableRow: {
    marginBottom: 5,
  },
  videoCell: {
    maxHeight: 60,
    paddingLeft: 5,
    width: '27%',
    fontSize: '0.9rem',
  },
  video: {
    height: 60,
    width: 100,
  },
  tableCell: {
    width: '12.0%',
    fontSize: '0.9rem',
  },
  buttonCell: {
    paddingRight: 15,
    width: '13%',
    fontSize: '0.9rem',
  },
});

export { marketplaceHomeStyles };
