import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';


const Stack = createStackNavigator(
  {
    Map: {
      screen: MapScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    initialRouteName: 'Map',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
    },
  },
);
const Navigation = createAppContainer(Stack);

export const ThemeContext = React.createContext(null);

export default class AppContainer extends React.Component {
  state = {
    theme: 'light',
  };

  toggleTheme = () => {
    this.setState(({theme}) => ({
      theme: theme === 'light' ? 'dark' : 'light',
    }));
  };
  render() {
    return (
      <ThemeContext.Provider
        value={{theme: this.state.theme, toggleTheme: this.toggleTheme}}>
        <Navigation screenProps={{theme: this.state.theme}} />
      </ThemeContext.Provider>
    );
  }
}
