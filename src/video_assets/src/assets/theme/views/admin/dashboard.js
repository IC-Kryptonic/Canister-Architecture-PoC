import { DarkGreyColor, PurpleColor } from '../../../../styles/shared_styles.tsx';
import boxShadows from '../../box-shadow.js';

const componentStyles = (theme) => ({
  cardRootBgGradient: {
    //background: 'linear-gradient(87deg,' + DarkGreyColor + ',#1a174d)!important',
    backgroundColor: '#14212c',
  },
  cardRoot: {
    boxShadow: boxShadows.boxShadow + '!important',
    border: '0!important',
  },
  cardHeaderRoot: {
    backgroundColor: 'initial!important',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  containerRoot: {
    [theme.breakpoints.up('md')]: {
      paddingLeft: '39px',
      paddingRight: '39px',
    },
  },
  buttonRootUnselected: {
    background: 'white !important',
    color: PurpleColor + ' !important',
  },
  gridItemRoot: {
    [theme.breakpoints.up('xl')]: {
      marginBottom: '0!important',
    },
  },
  tableRoot: {
    marginBottom: '0!important',
  },
  tableCellRoot: {
    verticalAlign: 'middle',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    borderTop: '0',
  },
  tableCellRootHead: {
    backgroundColor: 'grey',
    color: 'grey',
  },
  tableCellRootBodyHead: {
    textTransform: 'unset!important',
    fontSize: '.8125rem',
  },
  borderBottomUnset: {
    borderBottom: '0!important',
  },
  linearProgressRoot: {
    height: '3px!important',
    width: '120px!important',
    margin: '0!important',
  },
});

export default componentStyles;
