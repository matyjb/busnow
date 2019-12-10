import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';
import AsyncStorage from '@react-native-community/async-storage';

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
    var newTheme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setState({theme: newTheme});
    this._saveTheme(newTheme);
  };
  _saveTheme = async theme => {
    try {
      await AsyncStorage.setItem('@Settings:theme', theme);
    } catch (error) {
      console.log('error saving theme settings');
    }
  };
  _loadTheme = async () => {
    try {
      const value = await AsyncStorage.getItem('@Settings:theme');
      if (value !== null) {
        this.setState({theme: value});
      }
    } catch (error) {
      console.log('error loading theme settings');
    }
  };
  componentDidMount() {
    this._loadTheme();
  }
  render() {
    return (
      <ThemeContext.Provider
        value={{theme: this.state.theme, toggleTheme: this.toggleTheme}}>
        <Navigation screenProps={{theme: this.state.theme}} />
      </ThemeContext.Provider>
    );
  }
}
