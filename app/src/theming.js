import { createTheming } from '@callstack/react-theme-provider';

export const themes = {
  "default": {
    primaryColor: '#FFFFFF',
    secondaryColor: '#EDEDED',
    accentColor: '#F6BD67',
    
    headerColor: '#F6BD67',

    vehicleBgColor: '#FFFFFF',
    vehicleSelectedBgColor: '#F6BD67',
    vehicleSelectedTextColor: '#000000',

    stopBgColor: '#FFFFFF',
    stopIconColor: '#000000',
    stopSelectedBgColor: '#F6BD67',
    stopSelectedIconColor: '#FFFFFF',

    textColor: '#000000',

    // mapStyle: {

    // }
  },
  "dark": {
    primaryColor: '#494949',
    secondaryColor: '#6C6C6C',
    accentColor: '#F6BD67',

    headerColor: '#EDEDED',

    vehicleBgColor: '#5A5B65',
    vehicleSelectedBgColor: '#F6BD67',
    vehicleSelectedTextColor: '#000000',

    stopBgColor: '#494949',
    stopIconColor: '#FFFFFF',
    stopSelectedBgColor: '#F6BD67',
    stopSelectedIconColor: '#494949',

    textColor: '#FFFFFF',

    // mapStyle: {

    // }
  },
};
const { ThemeProvider, withTheme } = createTheming(
  themes.default
);

export { ThemeProvider, withTheme };