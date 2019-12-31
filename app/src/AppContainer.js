import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import MapScreen from './screens/MapScreen';
import SettingsScreen from './screens/SettingsScreen';
import {ThemeContext} from './contexts/ThemeContext';

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
  }
);
const Navigation = createAppContainer(Stack);

export default class AppContainer extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => <Navigation screenProps={theme} />}
      </ThemeContext.Consumer>
    );
  }
}
