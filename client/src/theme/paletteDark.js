import { red, blue, green } from '@material-ui/core/colors';
const white = '#FFF';
const black = '#000';
const brandRed = '#b72429';

export default {
  type: 'dark',
  common: {
    black,
    white,
    commonBackground: 'rgb(20, 20, 28)',
    contrastText: white,
    neutral: '#E4E7EB',
    muted: '#9EA0A4'
  },
  default: {
    light: 'rgba(183, 36, 41, .15)',
    main: 'rgba(20, 20, 28, .95)',
    dark: 'rgb(14, 14, 20)',
    logoBg: 'rgb(20, 20, 28)',
    border: 'rgba(183, 36, 41, .2)',
    contrastText: white
  },
  primary: {
    light: '#d94449',
    main: brandRed,
    dark: '#8b1c20',
    contrastText: white
  },
  success: {
    light: green[300],
    main: green[500],
    dark: green[700],
    contrastText: white
  },
  info: {
    light: blue[300],
    main: blue[500],
    dark: blue[700],
    contrastText: white
  },
  warning: {
    light: '#d94449',
    main: brandRed,
    dark: '#8b1c20',
    contrastText: white
  },
  danger: {
    light: red[300],
    main: red[500],
    dark: red[700],
    contrastText: white
  },
  background: {
    paper: 'rgb(22, 22, 30)',
    default: 'rgb(14, 14, 20)',
    dark: 'rgb(14, 14, 20)'
  },
  border: '#2a2a38',
  divider: '#2a2a38',
  gold: brandRed,
  oxfordBlue: 'rgba(5, 41, 73, 1)',
  prussianBlue: 'rgba(19, 49, 92, 1)',
  darkCerulean: 'rgba(19, 64, 116, 1)',
  pewterBlue: 'rgba(141, 169, 196, 1)',
  isabelline: 'rgba(238, 244, 237, 1)'
};
