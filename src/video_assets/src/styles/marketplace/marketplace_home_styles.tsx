import { makeStyles } from '@material-ui/core';

const marketplaceHomeStyles = makeStyles({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    // backgroundColor: '#e9e9ea',
    //backgroundImage:
    //  'linear-gradient(to bottom, #a6a8ac, #bcbdc0, #d2d3d5, #e9e9ea, #ffffff)',
    zIndex: -1,
  },
  cards: { maxWidth: 1280, marginTop: '3%' },
  table: { width: '100%', maxWidth: 1280, marginTop: '3%' },
  tableContent: { width: '100%', maxWidth: 1280, marginTop: 15 },
  thumbnail: { height: 60 },
  tableRow: {
    marginBottom: 5,
  },
  videoCell: {
    paddingLeft: 5,
    width: '19%',
  },
  tableCell: {
    width: '14%',
  },
  buttonCell: {
    paddingRight: 5,
    width: '10%',
  },
});

export { marketplaceHomeStyles };
